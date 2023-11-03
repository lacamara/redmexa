from django.contrib.gis.db.models import MultiPolygonField
from django.contrib.gis.measure import D
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.search import SearchVector, SearchRank
from django.db import models
from django.db.models import UniqueConstraint
from django.utils.html import format_html
from django.utils.translation import gettext as _

from agir.lib.model_fields import FacebookPageField, TwitterProfileField
from agir.lib.models import TimeStampedModel
from agir.lib.search import PrefixSearchQuery
from agir.lib.utils import front_url
from agir.people.models import Person


class RegexExtractorValidator:
    pass


class CommunePageQueryset(models.QuerySet):
    def search(self, search_terms):
        vector = SearchVector(
            models.F("name"), config="simple_unaccented", weight="A"
        ) + SearchVector(
            models.F("code_departement"), config="simple_unaccented", weight="B"
        )
        query = PrefixSearchQuery(search_terms, config="simple_unaccented")

        return (
            self.annotate(search=vector)
            .filter(search=query)
            .annotate(rank=SearchRank(vector, query))
            .order_by("-rank")
        )


class CommunePage(TimeStampedModel, models.Model):
    objects = CommunePageQueryset.as_manager()

    published = models.BooleanField(_("Publiée"), default=False, null=False)

    code = models.CharField(_("Code INSEE"), max_length=10, editable=False)
    code_departement = models.CharField(
        _("Code département"), max_length=3, editable=False
    )
    coordinates = MultiPolygonField(_("Périmètre de la commune"), geography=True)
    name = models.CharField(_("Nom de la commune"), max_length=255)
    slug = models.SlugField(_("Slug"))

    liste_tour_1 = models.CharField(
        _("Nom de la liste du 1er tour"),
        max_length=255,
        blank=True,
        help_text=_("Le nom de la liste tel qu'il sera affiché publiquement"),
    )

    tete_liste_tour_1 = models.CharField(
        _("Nom de la tête de liste au 1er tour"),
        max_length=255,
        blank=True,
        help_text=_("Le nom de la tête de liste, tel qu'il s'affichera publiquement"),
    )

    liste_tour_2 = models.CharField(
        _("Nom de la liste du 2e tour"),
        max_length=255,
        blank=True,
        help_text=_("Le nom de la liste tel qu'il sera affiché publiquement"),
    )

    tete_liste_tour_2 = models.CharField(
        _("Nom de la tête de liste au 2e tour"),
        max_length=255,
        blank=True,
        help_text=_("Le nom de la tête de liste, tel qu'il s'affichera publiquement"),
    )

    first_name_1 = models.CharField(
        _("Prénom chef⋅fe de file 1"), max_length=255, blank=True
    )
    last_name_1 = models.CharField(_("Nom chef⋅fe de file 1"), max_length=255, blank=True)
    first_name_2 = models.CharField(
        _("Prénom chef⋅fe de file 2"), max_length=255, blank=True
    )
    last_name_2 = models.CharField(_("Nom chef⋅fe de file 2"), max_length=255, blank=True)
    twitter = TwitterProfileField(
        _("Identifiant Twitter"),
        blank=True,
        help_text=_("Indiquez l'identifiant ou l'URL du compte Twitter de la campagne."),
    )
    facebook = FacebookPageField(
        _("Identifiant Facebook"),
        max_length=255,
        blank=True,
        help_text=_("Indiquez l'identifiant ou l'URL de la page Facebook de la campagne"),
    )

    website = models.URLField(
        _("Site web"),
        max_length=255,
        blank=True,
        help_text=_("Indiquez l'URL du site web de la liste en entier (avec le http:// ou le https://)"),
    )

    ordre_don = models.CharField(
        _("Ordre des chèques"),
        max_length=255,
        blank=True,
        help_text=_("Indiquez l'ordre auquel les chèques de dons doivent être adressés."),
    )

    adresse_don = models.TextField(
        _("Adresse complète pour les dons"),
        blank=True,
        help_text=_("Cette adresse sera affichée sur la page pour inciter les visiteurs à envoyer leurs dons par chèque."),
    )

    contact_email = models.EmailField(
        _("Adresse email de contact"),
        max_length=255,
        blank=True,
        help_text=_("Une adresse email publique qui peut être utilisée pour contacter votre campagne"),
    )

    mandataire_email = models.EmailField(
        _("Adresse email du mandataire financier"),
        max_length=255,
        blank=True,
        help_text=_("Nous aurons sans doute besoin pendant et après la campagne de transmettre des documents"
        " légaux au mandataire financier. Indiquez-nous une adresse qui nous permettra de le⋅a contacter à"
        " ce moment."),
    )

    chefs_file = models.ManyToManyField(
        "people.Person",
        verbose_name=_("Têtes de file pour les élections municipales de 2020"),
        related_name="municipales2020_commune",
        blank=True,
    )

    population = models.PositiveIntegerField(
        verbose_name=_("Population municipale"), null=True, blank=True
    )

    def __str__(self):
        return "{} ({})".format(self.name, self.code_departement)

    def chief(self, number):
        first_name = getattr(self, "first_name_" + number)
        last_name = getattr(self, "last_name_" + number)
        if not any([first_name, last_name]):
            return ""

        if all([first_name, last_name]):
            return first_name + " " + last_name

        return first_name or last_name

    @property
    def chief_1(self):
        return self.chief("1")

    @property
    def chief_2(self):
        return self.chief("2")

    @property
    def chiefs(self):
        if not any([self.chief_1, self.chief_2]):
            return ""

        if all([self.chief_1, self.chief_2]):
            return self.chief_1 + " et " + self.chief_2

        return self.chief_1 or self.chief_2

    def get_absolute_url(self):
        return front_url(
            "view_commune",
            kwargs={"code_departement": self.code_departement, "slug": self.slug},
        )

    def title_case(self):
        return "".join(c.title() for c in self.slug.split("-"))

    def snake_case(self):
        return "_".join(self.slug.split("-"))

    class Meta:
        constraints = (
            UniqueConstraint(fields=["code_departement", "slug"], name="dep_slug"),
        )
        verbose_name = _("Page de commune")
        verbose_name_plural = _("Pages de commune")


NUANCES_CHOICES = [
    ("LDVC", _("Divers centre")),
    ("LDVG", _("Divers gauche")),
    ("LEXG", _("Extrême gauche")),
    ("LDIV", _("Divers")),
    ("LDVD", _("Divers droite")),
    ("LREM", _("LREM")),
    ("LUG", _("Union de la gauche")),
    ("LUD", _("Union de la droite")),
    ("LRN", _("Rassemblement national")),
    ("LECO", _("Autre Ecologiste")),
    ("LSOC", _("Socialiste")),
    ("LCOM", _("Communiste")),
    ("LFI", _("FI")),
    ("LVEC", _("EELV")),
    ("LUDI", _("UDI")),
    ("LLR", _("Les Républicains")),
    ("LDLF", _("Debout la France")),
    ("LEXD", _("Extrême droite")),
    ("LRDG", _("Parti radical de gauche")),
    ("LMDM", _("Modem")),
    ("LUC", _("Union du centre")),
    ("LREG", _("Régionaliste")),
    ("LGJ", _("Gilets Jaunes")),
]


class Liste(models.Model):
    SOUTIEN_PUBLIC = "P"
    SOUTIEN_PREF = "O"
    SOUTIEN_NON = "N"
    SOUTIEN_CHOICES = (
        (SOUTIEN_PUBLIC, _("Soutien et participation de la FI")),
        (SOUTIEN_PREF, _("Préférence de la FI sans soutien")),
        (SOUTIEN_NON, _("Non soutenue")),
    )

    code = models.CharField(verbose_name=_("Code"), max_length=20, editable=False)
    nom = models.CharField(verbose_name=_("Nom de la liste"), max_length=300)
    commune = models.ForeignKey(
        CommunePage,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="listes",
        related_query_name="liste",
    )

    tour = models.IntegerField(
        _("Tour"), choices=[(1, _("Premier tour"), (2, "Deuxième tour"))]
    )

    nuance = models.CharField(
        verbose_name=_("Nuance politique"), max_length=4, choices=NUANCES_CHOICES
    )

    candidats_noms = ArrayField(
        verbose_name=_("Noms candidats"),
        base_field=models.CharField(max_length=200),
        default=list,
    )

    candidats_prenoms = ArrayField(
        verbose_name=_("Prénoms candidats"),
        base_field=models.CharField(max_length=200),
        default=list,
    )

    candidats_communautaire = ArrayField(
        verbose_name=_("Candidats pour le conseil communautaire"),
        base_field=models.BooleanField(),
        default=list,
    )

    soutien = models.CharField(
        verbose_name=_("Soutien ou participation de la FI"),
        max_length=1,
        choices=SOUTIEN_CHOICES,
        default=SOUTIEN_NON,
    )

    @property
    def tete_liste(self):
        return format_html(
            "<strong>{nom}</strong> {prenom}",
            nom=self.candidats_noms[0],
            prenom=self.candidats_prenoms[0],
        )

    @property
    def numero_panneau(self):
        return int(self.code.split("-")[-1])

    def __str__(self):
        return f"{self.numero_panneau}. {self.nuance} — «\u00a0{self.nom[:30]}\u00a0» ({self.candidats_noms[0]} {self.candidats_prenoms[0]})"

    def obtenir_comptes_candidats(self):
        return Person.objects.filter(
            coordinates__distance_lt=(self.commune.coordinates, D(m=10000)),
        ).search(
            *(
                f"{nom} {prenom}"
                for nom, prenom in zip(self.candidats_noms, self.candidats_prenoms)
            )
        )

    class Meta:
        constraints = [
            models.UniqueConstraint(name="code_unique", fields=["tour", "code"]),
            models.UniqueConstraint(
                name="commune_soutenue_unique",
                fields=["tour", "commune"],
                condition=~models.Q(soutien="N"),
            ),
        ]
        ordering = ("code",)
