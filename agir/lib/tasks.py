from django.contrib.gis.geos import Point
from django.db import IntegrityError

from agir.carte.models import StaticMapImage
from agir.geodata.geocoding import geocode_element
from agir.people.models import Person
from .celery import http_task

__all__ = ["geocode_person", "create_static_map_image_from_coordinates"]


@http_task(post_save=True)
def geocode_person(person_pk):
    person = Person.objects.get(pk=person_pk)
    geocode_element(person)
    person.save()


@http_task()
def create_static_map_image_from_coordinates(coordinates):
    center = Point(*coordinates)
    try:
        # Do not create image if one exists for a close enough point
        StaticMapImage.objects.get(
            center__dwithin=(center, StaticMapImage.UNIQUE_CENTER_MAX_DISTANCE)
        )
        return
    except StaticMapImage.MultipleObjectsReturned:
        return
    except StaticMapImage.DoesNotExist:
        pass

    try:
        StaticMapImage.objects.create_from_jawg(center=center)
    except IntegrityError:
        # Ignore error if image already exists for the given coordinates
        pass
