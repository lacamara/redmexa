import reversion
from django.db import models
from django.utils.translation import gettext_lazy as _, gettext

from agir.lib.models import TimeStampedModel
from agir.people.models import Person


__all__ = ("Commentaire",)


@reversion.register(follow=["projet_set", "depense_set"])
class Commentaire(TimeStampedModel):
    class Type(models.TextChoices):
        REM = "R", "Remarque"
        TODO = "T", "Todo"

    auteur = models.ForeignKey(
        to="people.Person",
        verbose_name=_("Auteur⋅ice"),
        on_delete=models.SET_NULL,
        related_name="+",
        null=True,
    )

    auteur_nom = models.CharField(
        verbose_name=_("Nom de l'auteur"),
        blank=False,
        max_length=200,
        help_text=_("Pour pouvoir afficher un nom si la personne a été supprimée."),
    )

    type = models.CharField(
        verbose_name=_("Type de commentaire"), max_length=1, choices=Type.choices
    )

    texte = models.TextField(verbose_name=_("Texte du commentaire"), blank=False)

    cache = models.BooleanField(verbose_name=_("Commentaire caché"), default=False)

    def get_auteur_display(self):
        if self.auteur:
            disp = str(self.auteur)
            if self.auteur_nom != disp:
                self.auteur_nom = disp
                self.save(update_fields=["auteur_nom"])
            return str(disp)
        else:
            return self.auteur_nom

    class Meta:
        ordering = ("created",)


def ajouter_commentaire(instance, texte, type, auteur: Person):
    c = Commentaire.objects.create(
        auteur=auteur, auteur_nom=auteur.get_full_name(), texte=texte, type=type
    )
    instance.commentaires.add(c)


def nombre_commentaires_a_faire(instance):
    return instance.commentaires.filter(type=Commentaire.Type.TODO, cache=False).count()
