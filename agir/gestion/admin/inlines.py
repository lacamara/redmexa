from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html_join, format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _, gettext


from agir.gestion.admin.base import SearchableModelMixin
from agir.gestion.admin.depenses import DepenseListMixin
from agir.gestion.admin.forms import (
    AjoutRapideDepenseForm,
    DocumentAjoutRapideForm,
    InlineReglementForm,
)
from agir.gestion.models import Depense, Projet, Participation, Reglement
from agir.gestion.models.documents import VersionDocument
from agir.gestion.utils import lien
from agir.lib.admin.form_fields import CleavedDateInput


class BaseDocumentInline(admin.TabularInline):
    verbose_name = _("Document justificatif")
    verbose_name_plural = _("Documents justificatifs")
    extra = 0
    classes = ("retirer-original",)
    can_delete = False

    fields = readonly_fields = (
        "numero",
        "type_document",
        "date",
        "precision",
        "identifiant",
        "fichier_document",
    )

    def has_add_permission(self, request, obj):
        return False

    def type_document(self, obj):
        if obj and obj.document:
            return obj.document.get_type_display()
        return "-"

    type_document.short_description = _("Type de document")

    def fichier_document(self, obj):
        if obj and obj.document:
            doc = obj.document
            if doc.fichier:
                return format_html(
                    '<a href="{}">{}</a>', doc.fichier.url, doc.fichier.name
                )
            else:
                return mark_safe(_("<strong>Fichier manquant</strong>"))
        return "-"

    fichier_document.short_description = _("Voir le fichier")

    def numero(self, obj):
        if obj and obj.document:
            return format_html(
                '<a href="{}">{}</a>',
                reverse("admin:gestion_document_change", args=(obj.document.id,)),
                obj.document.numero,
            )
        return "-"

    numero.short_description = _("Numéro unique")

    def precision(self, obj):
        if obj and obj.document:
            return obj.document.precision
        return "-"

    precision.short_description = _("Précision")

    def identifiant(self, obj):
        if obj and obj.document:
            return obj.document.identifiant or "-"
        return "-"

    identifiant.short_description = _("Numéro ou identifiant")

    def date(self, obj):
        if obj and obj.document:
            return obj.document.date or "-"
        return "-"

    date.short_description = _("Date")


class DepenseDocumentInline(BaseDocumentInline):
    model = Depense.documents.through


class DepenseInline(DepenseListMixin, SearchableModelMixin, admin.TabularInline):
    verbose_name = _("Dépense")
    verbose_name_plural = _("Dépenses du projet")

    model = Depense
    extra = 0
    show_change_link = True
    can_delete = False

    def has_add_permission(self, request, obj):
        return False

    fields = ("numero_", "titre", "type", "montant", "date_depense", "compte")
    readonly_fields = ("titre", "montant", "type", "date_depense", "compte")

    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj=obj)
        if not request.user.has_perm("gestion.voir_montant_depense"):
            return tuple(f for f in fields if f != "montant")
        return fields


class ProjetDocumentInline(BaseDocumentInline):
    model = Projet.documents.through


def depense_type(type, label):
    def func(self, obj):
        if obj and obj.projet and obj.person:
            dep = obj.projet.depenses.filter(
                beneficiaires=obj.person, type__startswith=type
            )

            creation_url = "{}?projet={}&person={}&type={}".format(
                reverse("admin:gestion_depense_add"),
                obj.projet_id,
                obj.person_id,
                type,
            )
            add_button = format_html(
                '<div><a class="gestion--button" href="{}">Ajouter</a></div>',
                creation_url,
            )

            if dep:
                return format_html(
                    '<ul class="gestion--liste"><li>{}</li></ul>{}',
                    format_html_join(
                        "</li><li>",
                        '<a href="{}">{}</a>',
                        (
                            (
                                reverse("admin:gestion_depense_change", args=(d.id,)),
                                f"{d.numero} ({d.montant} $)",
                            )
                            for d in dep
                        ),
                    ),
                    add_button,
                )
            else:
                return add_button

        return "-"

    func.short_description = label
    return func


class ProjetParticipationInline(admin.TabularInline):
    verbose_name_plural = _("Personnes impliquées dans ce projet")
    model = Participation
    extra = 1

    fields = (
        "person",
        "role",
        "precisions",
        "depense_transport",
        "depense_hebergement",
    )
    autocomplete_fields = ("person",)
    readonly_fields = ("depense_transport", "depense_hebergement")

    depense_transport = depense_type("TRA", _("Dépenses de transport"))
    depense_hebergement = depense_type("FRH", _("Dépenses d'hébergement"))


class VersionDocumentInline(admin.TabularInline):
    model = VersionDocument

    extra = 0
    show_change_link = True
    can_delete = True

    def has_add_permission(self, request, obj):
        return False

    fields = ("titre", "date", "fichier")
    readonly_fields = ("titre", "date", "fichier")


class AjoutRapideMixin:
    extra = 1
    can_delete = False
    classes = ("ajout-rapide",)

    def has_change_permission(self, request, obj=None):
        return False

    def has_view_permission(self, request, obj=None):
        return False


class AjouterDepenseInline(AjoutRapideMixin, admin.TabularInline):
    verbose_name_plural = _("Ajout rapide de dépenses")
    model = Depense
    form = AjoutRapideDepenseForm

    fields = ("titre", "type", "montant", "compte", "type_document", "fichier")


class BaseAjouterDocumentInline(AjoutRapideMixin, admin.TabularInline):
    verbose_name_plural = _("Ajout rapide de documents justificatifs")
    form = DocumentAjoutRapideForm
    fields = ("type", "identifiant", "precision", "date", "fichier")


class AjouterDocumentProjetInline(BaseAjouterDocumentInline):
    model = Projet.documents.through


class AjouterDocumentDepenseInline(BaseAjouterDocumentInline):
    model = Depense.documents.through


class DepenseReglementInline(admin.TabularInline):
    classes = ("retirer-original",)
    model = Reglement
    form = InlineReglementForm

    fields = (
        "etat_lien",
        "numero",
        "intitule",
        "mode",
        "montant",
        "date",
        "date_releve",
        "facture",
        "preuve_link",
        "fournisseur_link",
    )

    readonly_fields = (
        "etat_lien",
        "mode",
        "preuve_link",
        "fournisseur_link",
    )

    def has_add_permission(self, request, obj):
        return False

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(etat__in=[Reglement.Etat.EXPERTISE, Reglement.Etat.FEC])

    def get_formset(self, request, obj=None, **kwargs):
        kwargs.setdefault("widgets", {}).setdefault("date_releve", CleavedDateInput)
        return super().get_formset(request, obj=obj, **kwargs)

    @admin.display(description="État")
    def etat_lien(self, obj):
        if obj.id:
            return lien(
                reverse("admin:gestion_reglement_change", args=(obj.id,)),
                obj.get_etat_display(),
            )

        return obj.get_etat_display()

    @admin.display(description=_("Preuve de paiement"))
    def preuve_link(self, obj):
        if obj and obj.preuve:
            change_url = reverse("admin:gestion_document_change", args=(obj.preuve_id,))

            if obj.preuve.fichier:
                return format_html(
                    '<a href="{}">{}</a> <a href="{}">\U0001F4C4</a>',
                    change_url,
                    obj.preuve.precision or _("Preuve de paiement"),
                    obj.preuve.fichier.url,
                )

            return lien(
                change_url,
                obj.preuve.precision,
            )
        return "-"

    @admin.display(description=_("Fournisseur"))
    def fournisseur_link(self, obj):
        if obj and obj.fournisseur:
            return format_html(
                '<a href="{}">{}</a>',
                reverse("admin:gestion_fournisseur_change", args=(obj.fournisseur_id,)),
                obj.fournisseur.nom,
            )

        return "-"


class DepenseReglementLectureSeuleInline(DepenseReglementInline):
    verbose_name_plural = _("Règlements clos")
    can_delete = False

    def has_change_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        # appeler le parent d'au-dessus
        qs = super(DepenseReglementInline, self).get_queryset(request)

        return qs.filter(etat__in=[Reglement.Etat.EXPERTISE, Reglement.Etat.FEC])


class OrdreVirementReglementInline(admin.TabularInline):
    classes = ("retirer-original",)
    model = Reglement
    extra = 0
    can_delete = False

    fields = (
        "depense_link",
        "intitule",
        "montant",
        "date",
    )
    readonly_fields = ("depense_link",)

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def depense_link(self, obj):
        return format_html(
            '<a href="{}">{}</a>',
            reverse("admin:gestion_depense_change", args=(obj.depense_id,)),
            obj.depense.titre,
        )

    depense_link.short_description = _("Dépense")

    # TODO: gérer ici les permissions sur les règlements déjà validés à l'aide de la définiton de get_queryset
    # il faut faire deux inlines différents, pour ceux en lecture seule et pour ceux modifiables
