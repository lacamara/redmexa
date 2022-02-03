from functools import reduce
from io import BytesIO
from operator import or_

import pandas as pd
from django.db.models import Q, Exists, OuterRef, Count
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils import timezone
from django.views.generic import TemplateView
from glom import glom, Coalesce

from agir.elus.models import (
    RechercheParrainage,
    AccesApplicationParrainages,
    types_elus,
)
from agir.lib.admin.panels import AdminViewMixin
from agir.people.models import Person


class ChangerStatutBaseView(AdminViewMixin, TemplateView):
    statut = None

    def dispatch(self, request, *args, **kwargs):
        self.object = get_object_or_404(RechercheParrainage, pk=kwargs["object_id"])

        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object.statut = self.statut
        self.object.save(update_fields=["statut"])

        return HttpResponseRedirect(
            reverse("admin:elus_rechercheparrainage_change", args=(self.object.id,))
        )

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs, object=self.object)


class ConfirmerParrainageView(ChangerStatutBaseView):
    statut = RechercheParrainage.Statut.VALIDEE
    template_name = "elus/admin/confirmer_parrainage.html"


class AnnulerParrainageView(ChangerStatutBaseView):
    statut = RechercheParrainage.Statut.ANNULEE
    template_name = "elus/admin/annuler_parrainage.html"


class ExporterAccesApplication(AdminViewMixin):
    def get(self, request, *args, **kwargs):
        if not self.model_admin.has_view_permission(request):
            return HttpResponseForbidden("Interdit")

        avec_acces = Q(
            acces_application_parrainages__etat=AccesApplicationParrainages.Etat.VALIDE
        )
        est_elu = reduce(or_, (Q(**{f"elu_{m}": True}) for m in types_elus))
        signataire_appel = Q(meta__subscriptions__NSP__mandat__isnull=False)

        ps = (
            Person.objects.annotate_elus()
            .filter(avec_acces | (est_elu & signataire_appel))
            .annotate(
                volontaire=Exists(
                    AccesApplicationParrainages.objects.filter(
                        person_id=OuterRef("id"),
                        etat=AccesApplicationParrainages.Etat.VALIDE,
                    ),
                ),
                en_cours=Count(
                    "rechercheparrainage",
                    filter=Q(
                        rechercheparrainage__statut=RechercheParrainage.Statut.EN_COURS
                    ),
                ),
                fini=Count(
                    "rechercheparrainage",
                    filter=~Q(
                        rechercheparrainage__statut__in=[
                            RechercheParrainage.Statut.EN_COURS,
                            RechercheParrainage.Statut.ANNULEE,
                        ]
                    ),
                ),
            )
        )

        spec = {
            "email": "email",
            "prenom": "first_name",
            "nom": "last_name",
            "téléphone": Coalesce("contact_phone.as_international", default=None),
            "code postal": "location_zip",
            "ville": "location_city",
            "volontaire": ("volontaire", {True: "oui", False: "non"}.get),
            "nombre de recherches en cours": "en_cours",
            "nombre de recherches terminées": "fini",
        }

        df = pd.DataFrame(glom(ps, [spec]))
        content = BytesIO()
        df.to_excel(content, engine="xlsxwriter", index=False)

        today = timezone.now().strftime("%Y-%m-%d")

        res = HttpResponse(
            content.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        res[
            "Content-Disposition"
        ] = f'attachment; filename="{today}-acces-parrainages.xlsx"'

        return res
