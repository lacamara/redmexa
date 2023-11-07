from django.db import models

from agir.lib.form_fields import CustomJSONEncoder
from agir.lib.models import DescriptionField
from django.utils.translation import gettext_lazy as _

class Cagnotte(models.Model):
    nom = models.CharField(
        max_length=100,
        help_text=_("Utilisé notamment dans le profil sur la page des dons d'une personne."),
    )
    slug = models.SlugField(
        help_text=_("Utilisé dans l'URL pour cette cagnotte"), unique=True
    )
    public = models.BooleanField(null=False, default=True)
    titre = models.CharField(
        max_length=100,
        help_text=_("Utilisée en titre principal de la page de dons elle-même."),
    )
    legal = DescriptionField(
        blank=True,
        help_text=_("Texte additionnel à indiquer en haut de la colonne de texte légal sur la page de dons."),
    )
    description = DescriptionField(
        blank=True,
        help_text=_("Texte affiché dans le profil sur la page des dons d'une personne."),
    )

    url_remerciement = models.URLField(
        "URL de remerciement",
        help_text=_("L'URL vers laquelle rediriger après le paiement."),
        blank=False,
    )

    expediteur_email = models.CharField(
        max_length=200,
        help_text=_("Adresse d'expédition pour l'email de remerciement"),
        blank=True,
    )

    remerciements = DescriptionField(
        help_text=_("Message de remerciement notamment utilisé dans le mail de confirmation."),
        blank=True,
    )

    meta = models.JSONField(
        _("Paramètres de la cagnotte"),
        default=dict,
        blank=True,
        encoder=CustomJSONEncoder,
    )

    def __repr__(self):
        return f"Cagnotte(id={self.id}, slug={self.slug!r})"

    def __str__(self):
        return self.nom
