import logging
import re

import requests
from data_france.models import CodePostal, Commune
from django.conf import settings
from django.contrib.gis.geos import Point
from unidecode import unidecode

from agir.geodata.models import USZipCode
from agir.lib.data import code_postal_vers_code_departement
from agir.lib.models import LocationMixin

logger = logging.getLogger(__name__)


NON_DIGIT = re.compile("[^\d]+")
NON_WORD = re.compile("[^\w]+")
MULTIPLE_SPACES = re.compile("\s\s+")
BAN_ENDPOINT = "https://api-adresse.data.gouv.fr/search"
NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/"

GMAPS_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json"

FRENCH_COUNTRY_CODES = [
    "FR",  # France métropolitaine
    "GP",  # Guadeloupe
    "GF",  # Guyane française
    "RE",  # La Réunion
    "MQ",  # Martinique
    "YT",  # Mayotte
    "NC",  # Nouvelle-Calédonie
    "PF",  # Polynésie française
    "BL",  # Saint-Barthélemy
    "MF",  # Saint-Martin
    "PM",  # Saint-Pierre-et-Miquelon
    "TF",  # Terres australes françaises
    "WF",  # Wallis-et-Futuna
]

US_COUNTRY_CODES = [
    "US",
    "AS",  # American Samoa
    "GU",  # Guam
    "MP",  # Northern Mariana Islands
    "PR",  # Puerto Rico
    "UM",  # United States Minor Outlying Islands
    "VI",  # Virgin Islands, U.S.
]


def normalize_city_name(s):
    return MULTIPLE_SPACES.sub(" ", NON_WORD.sub(" ", unidecode(s.strip()))).lower()


def remove_non_digit(zip_code):
    return NON_DIGIT.sub("", zip_code.strip())


def is_geocodable(item):
    return item.location_city or item.location_zip


def is_in_france(item):
    return item.location_country in FRENCH_COUNTRY_CODES


def is_in_united_states(item):
    return not item.location_country or item.location_country in US_COUNTRY_CODES


def geocode_element(item):
    """Geocode an item in the background

    :param item:
    :return:
    """

    if not is_geocodable(item):
        item.coordinates = None
        item.coordinates_type = LocationMixin.COORDINATES_NO_POSITION
        return

    if is_in_united_states(item):
        geocode_us(item)
        return

    if is_in_france(item):
        geocode_france(item)
        return

    geocode_internationally(item)


def geocode_us(item):
    item.location_zip = remove_non_digit(item.location_zip)

    if item.location_address1 or item.location_address2 or item.location_city:
        if geocode_internationally(item):
            return

    if item.location_zip:
        geocode_american_zip(item)


def geocode_american_zip(item):
    try:
        z = USZipCode.objects.select_related("state").get(code=item.location_zip)
    except USZipCode.DoesNotExist:
        return
    else:
        item.coordinates = z.coordinates
        item.coordinates_type = LocationMixin.COORDINATES_UNKNOWN_PRECISION
        item.location_state = z.state.name


def geocode_france(item):
    """Trouver la localisation géographique d'un item

    Si on a juste un code postal ou une ville, on utilise les coordonnées données
    par data_france.

    Dans le cas où on a une adresse plus précise, on peut aller interroger la BAN.
    """

    # Normalize location_zip field
    item.location_zip = remove_non_digit(item.location_zip)

    # First reset coordinate fields to avoid asynchronisation
    item.coordinates = None
    item.coordinates_type = LocationMixin.COORDINATES_NOT_FOUND

    # Try to geolocate with BAN if the full address is given
    if not geocode_ban(item):
        # Fallback to data france if address is incomplete or no BAN result has been found
        geocode_data_france(item)


def geocode_ban(item):
    if not item.location_address1 and not item.location_address2:
        return False

    item.location_citycode = ""

    q = " ".join(
        l
        for l in [
            item.location_address1,
            item.location_address2,
            item.location_zip,
            item.location_city,
        ]
        if l
    )

    query = {
        "q": q,
        "postcode": item.location_zip,
        "limit": 5,
    }
    results = get_results_from_ban(query)

    if results is None:
        return False

    types = {
        "housenumber": LocationMixin.COORDINATES_EXACT,
        "street": LocationMixin.COORDINATES_STREET,
        "city": LocationMixin.COORDINATES_CITY,
    }

    features = [
        feature
        for feature in results["features"]
        if feature["geometry"]["type"] == "Point"
        and feature["properties"]["type"] in types
    ][:1]

    if features:
        feature = features[0]
        item.coordinates = Point(*feature["geometry"]["coordinates"])
        item.coordinates_type = types[feature["properties"]["type"]]
        item.location_citycode = feature["properties"]["citycode"]

        if not item.location_zip and "postcode" in feature["properties"]:
            item.location_zip = feature["properties"]["postcode"]

        item.location_departement_id = code_postal_vers_code_departement(
            item.location_zip
        )

        return True

    return False


def get_results_from_ban(query):
    try:
        res = requests.get(BAN_ENDPOINT, params=query, timeout=(5, 10))
    except requests.RequestException:
        logger.warning(
            f"Network error while geocoding '{query!r}' with BAN", exc_info=True
        )
        raise

    if 400 <= res.status_code < 500:
        # Erreur dans les données fournies, probablement un code postal incorrect
        # on ne peut pas localiser et ça ne sert à rien de réessayer.
        return None
    elif 500 <= res.status_code < 600:
        # erreur côté serveur, il y a des chances que ça remarche en réessayant
        raise requests.HTTPError("Erreur côté serveur", response=res)

    try:
        results = res.json()
    except ValueError:
        logger.warning(
            f"Invalid JSON while geocoding '{query!r}' with BAN", exc_info=True
        )
        raise

    if "features" not in results:
        logger.warning(f"Incorrect result from BAN for address '{query!r}'")
        return None
    return results


def geocode_data_france(item):
    if item.location_zip:
        try:
            code_postal = CodePostal.objects.get(
                code=remove_non_digit(item.location_zip)
            )
        except CodePostal.DoesNotExist:
            pass
        else:
            nb_communes = code_postal.communes.count()

            if nb_communes == 1:
                commune = code_postal.communes.get()
                item.location_city = commune.nom_complet
                item.location_citycode = commune.code
                item.location_departement_id = commune.code_departement
                item.coordinates = commune.geometry.centroid
                item.coordinates_type = (
                    LocationMixin.COORDINATES_CITY
                    if commune.type == Commune.TYPE_COMMUNE
                    else LocationMixin.COORDINATES_DISTRICT
                )
                return

            if nb_communes > 1 and item.location_city:
                nom_normalise = normalize_city_name(item.location_city)
                try:
                    commune = next(
                        v
                        for v in code_postal.communes.all()
                        if normalize_city_name(v.nom) == nom_normalise
                    )
                    if commune.geometry:
                        item.location_citycode = commune.code
                        item.location_departement_id = commune.code_departement
                        item.coordinates = commune.geometry.centroid
                        item.coordinates_type = (
                            LocationMixin.COORDINATES_CITY
                            if commune.type == Commune.TYPE_COMMUNE
                            else LocationMixin.COORDINATES_DISTRICT
                        )
                        return
                except StopIteration:
                    pass

            if nb_communes > 1:
                code_postal = CodePostal.objects.raw(
                    """
                    SELECT cp.*, ST_CENTROID(ST_UNION(c.geometry :: geometry)) centroid
                    FROM data_france_codepostal cp
                    JOIN data_france_codepostal_communes cc ON cp.id = cc.codepostal_id
                    JOIN data_france_commune c on cc.commune_id = c.id
                    WHERE cp.id = %(cp_id)s
                    GROUP BY cp.id; 
                """,
                    {"cp_id": code_postal.id},
                )[0]
                item.location_departement_id = code_postal_vers_code_departement(
                    item.location_zip
                )
                item.coordinates = code_postal.centroid
                item.coordinates_type = LocationMixin.COORDINATES_UNKNOWN_PRECISION
                return

    item.location_zip = ""

    # pas de code postal
    if item.location_city:
        nom_normalise = normalize_city_name(item.location_city)
        communes = [
            c
            for c in Commune.objects.search(item.location_city)
            if normalize_city_name(c.nom_complet) == nom_normalise
        ]

        if len(communes) == 1:
            commune = communes[0]
            if commune.geometry is not None:
                item.location_city = commune.nom_complet
                item.location_citycode = commune.code
                item.location_departement_id = commune.code_departement
                item.coordinates = commune.geometry.centroid
                item.coordinates_type = (
                    LocationMixin.COORDINATES_CITY
                    if commune.type == Commune.TYPE_COMMUNE
                    else LocationMixin.COORDINATES_DISTRICT
                )
                return

    item.location_city = ""

    if item.location_citycode:
        try:
            commune = Commune.objects.get(code=item.location_citycode)
        except Commune.MultipleObjectsReturned:
            commune = Commune.objects.get(
                code=item.location_citycode, type=Commune.TYPE_COMMUNE
            )
        except Commune.DoesNotExist:
            commune = None

        if commune is not None:
            item.location_city = commune.nom_complet
            item.location_citycode = commune.code
            item.location_departement_id = commune.code_departement
            item.coordinates = commune.geometry.centroid
            item.coordinates_type = (
                LocationMixin.COORDINATES_CITY
                if commune.type == Commune.TYPE_COMMUNE
                else LocationMixin.COORDINATES_DISTRICT
            )
            return

    item.location_citycode = ""
    item.coordinates = None
    item.coordinates_type = LocationMixin.COORDINATES_NOT_FOUND


def geocode_internationally(item):
    """Find location of an item with its address for non French addresses

    :return: True if the item has changed (and should be saved), False in the other case
    """
    address = " ".join([item.location_address1, item.location_address2]).strip()
    components = {
        "postal_code": item.location_zip,
        "country": item.location_country,
        "locality": item.location_city,
        "administrative_area": item.location_state
    }
    components = "|".join(f"{k}:{v}" for k, v in components.items() if v)

    query = {"key": settings.GOOGLE_MAPS_KEY}
    if address:
        query["address"] = address

    if components:
        query["components"] = components

    display_address = f"{address} {components}"

    try:
        res = requests.get(
            GMAPS_ENDPOINT,
            params=query,
        )
        res.raise_for_status()
        results = res.json()
    except requests.RequestException:
        logger.warning(
            f"Error while geocoding address '{display_address}' with Nominatim",
            exc_info=True,
        )
        raise
    except ValueError:
        logger.warning(
            f"Invalid JSON while geocoding address '{display_address}' with Nominatim",
            exc_info=True,
        )
        raise

    if results["results"] and "geometry" in results["results"][0]:
        location = results["results"][0]["geometry"]["location"]

        item.coordinates = Point(float(location["lng"]), float(location["lat"]))
        item.coordinates_type = LocationMixin.COORDINATES_UNKNOWN_PRECISION
        return True
    else:
        item.coordinates = None
        item.coordinates_type = LocationMixin.COORDINATES_NOT_FOUND
        return False


def get_commune(item):
    commune = None
    if item.location_citycode:
        try:
            commune = Commune.objects.get(code=item.location_citycode)
        except Commune.MultipleObjectsReturned:
            commune = Commune.objects.get(
                code=item.location_citycode, type=Commune.TYPE_COMMUNE
            )
        except Commune.DoesNotExist:
            commune = None
    if item.location_zip:
        try:
            code_postal = CodePostal.objects.get(code=item.location_zip)
        except CodePostal.DoesNotExist:
            pass
        else:
            nb_communes = code_postal.communes.count()
            if nb_communes == 1:
                commune = code_postal.communes.get()
            if nb_communes > 1 and item.location_city:
                nom_normalise = normalize_city_name(item.location_city)
                try:
                    commune = next(
                        v
                        for v in code_postal.communes.all()
                        if normalize_city_name(v.nom) == nom_normalise
                    )
                except StopIteration:
                    pass
    if item.location_city:
        nom_normalise = normalize_city_name(item.location_city)
        communes = [
            c
            for c in Commune.objects.search(item.location_city)
            if normalize_city_name(c.nom_complet) == nom_normalise
        ]
        if len(communes) == 1:
            commune = communes[0]

    return commune
