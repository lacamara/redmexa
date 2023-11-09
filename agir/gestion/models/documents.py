import hashlib
import re

import dynamic_filenames
import reversion
from django.core.validators import RegexValidator
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _, gettext

from agir.gestion.models.common import ModeleGestionMixin, NumeroManager
from agir.gestion.typologies import TypeDocument
from agir.lib.models import TimeStampedModel


__all__ = ["Document", "VersionDocument"]


NUMERO_PIECE_REF_RE = re.compile(
    r"^(?P<compte>\d{5})(?P<departement>\d\d[\dAB])(?P<ordre>\d{4})$"
)


class DocumentManager(NumeroManager):
    def create(self, fichier=None, **kwargs):
        with transaction.atomic():
            document = super().create(**kwargs)

            if fichier is not None:
                VersionDocument.objects.create(
                    document=document,
                    titre="Version initiale",
                    fichier=fichier,
                )

        return document


@reversion.register(follow=("versions",))
class Document(ModeleGestionMixin, TimeStampedModel):
    """Modèle représentant un élément justificatif, à associer à une instance d'un autre modèle de gestion"""

    objects = DocumentManager()

    class Besoin(models.TextChoices):
        NECESSAIRE = "NEC", _("Strictement nécessaire")
        PREFERABLE = "PRE", _("Préférable")
        IGNORER = "IGN", _("Peut être ignoré")

    precision = models.CharField(
        verbose_name=_("Précision sur la nature du document"),
        help_text=_("Titre permettant d'identifier le document"),
        max_length=200,
        blank=True,
    )

    identifiant = models.CharField(
        verbose_name=_("Numéro ou identifiant"),
        max_length=100,
        blank=True,
        help_text=_(
            "Indiquez ici si ce document a un identifiant ou un numéro (numéro de facture ou de devis, identifiant de transaction, etc.)"
        ),
    )

    numero_piece = models.CharField(
        verbose_name=_("Numéro de pièce justificative"),
        max_length=12,
        validators=(RegexValidator(regex=NUMERO_PIECE_REF_RE),),
        unique=True,
        blank=True,
        null=True,
        help_text=_(
            "Le numéro de pièce justificative à utiliser pour l'export vers FinPol."
        ),
        default=None,
    )

    date = models.DateField(
        verbose_name=_("Date du document"),
        null=True,
        blank=True,
        help_text=_("Si le document a une date, indiquez-la ici."),
    )

    type = models.CharField(
        verbose_name=_("Type de document"), max_length=10, choices=TypeDocument.choices
    )

    description = models.TextField(
        _("Description du document"),
        help_text=_(
            "Toute description complémentaire nécessaire pour identifier clairement le document (et le rechercher)"
        ),
        blank=True,
    )

    source_url = models.URLField(
        verbose_name=_("URL d'origine"),
        help_text=_(
            "Si ce document provient d'internet, l'URL de la source d'origine."
        ),
        blank=True,
    )

    meta = models.JSONField(
        verbose_name=_("métadonnées"),
        null=False,
        default=dict,
    )

    search_config = (
        ("numero", "B"),
        ("precision", "A"),
        ("identifiant", "A"),
        ("description", "C"),
        ("numero_piece", "A"),
    )

    def __str__(self):
        s = self.get_type_display()
        if self.precision:
            s = f"{s} - {self.precision}"
        if not self.fichier:
            s = f"{s} (MANQUANT)"
        return s

    @property
    def fichier(self):
        return getattr(self.versions.last(), "fichier", None)

    def attribuer_numero(self, compte, code_dep, changer=False):
        if len(compte) != 5:
            raise ValueError(_("Le numéro de compte doit être sur 5 chiffres"))

        code_dep = code_dep.zfill(3)

        if self.numero_piece is not None and not changer:
            raise ValueError(_("Cette pièce a déjà un numéro de pièce finpol !"))

        with transaction.atomic():
            num_max = (
                Document.objects.filter(numero_piece__startswith=f"{compte}{code_dep}")
                .select_for_update()
                .aggregate(m=models.Max("numero_piece"))["m"]
            )

            if num_max is None:
                ordre = 0
            else:
                ordre = int(num_max[-4:])

            numero_piece = f"{compte}{code_dep}{ordre+1:04d}"

            if not NUMERO_PIECE_REF_RE.match(numero_piece):
                raise ValueError(
                    gettext(f"Numéro de pièce obtenu {numero_piece} incorrect !")
                )

            self.numero_piece = numero_piece
            self.save(update_fields=["numero_piece"])

    class Meta:
        verbose_name = _("Document justificatif")
        verbose_name_plural = _("Documents justificatifs")


@reversion.register()
class VersionDocument(models.Model):
    document = models.ForeignKey(
        Document,
        blank=False,
        on_delete=models.CASCADE,
        related_name="versions",
        related_query_name="version",
    )

    date = models.DateTimeField(
        _("Date de téléchargement"), auto_now_add=True, editable=False
    )

    titre = models.CharField(
        verbose_name=_("Titre de la version"), max_length=200, blank=False
    )

    fichier = models.FileField(
        verbose_name=_("Fichier pour cette version"),
        null=False,
        blank=False,
        upload_to=dynamic_filenames.FilePattern(
            filename_pattern="gestion/documents/{uuid:.2base32}/{uuid}{ext}"
        ),
    )

    hash = models.CharField(
        verbose_name=_("Hash MD5"),
        editable=False,
        max_length=32,
    )

    class Meta:
        verbose_name = _("Version")
        ordering = ("document", "date")
