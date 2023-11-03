import reversion
from django.contrib import admin, messages
from django.http import StreamingHttpResponse
from django.utils import timezone
from django.utils.translation import gettext as _, ngettext

from ..actions import groups_to_csv_lines
from ..tasks import (
    send_newly_certified_group_notifications,
    send_uncertified_group_notifications,
    subscribe_supportgroup_referents_to_main_newsletters,
)


def export_groups(modeladmin, request, queryset):
    response = StreamingHttpResponse(
        groups_to_csv_lines(queryset), content_type="text/csv"
    )
    response["Content-Disposition"] = "inline; filename=export_groups_{}.csv".format(
        timezone.now()
        .astimezone(timezone.get_default_timezone())
        .strftime("%Y%m%d_%H%M")
    )

    return response


export_groups.short_description = _("Exporter les groupes en CSV")


def make_published(modeladmin, request, queryset):
    queryset.update(published=True)


make_published.short_description = _("Publier les groupes")


def unpublish(modeladmin, request, queryset):
    queryset.update(published=False)


unpublish.short_description = _("Dépublier les groupes")


@admin.display(description="Certifier les groupes sélectionnés")
def certify_supportgroups(modeladmin, request, qs):
    now = timezone.now()
    groups = qs.uncertified().select_for_update()
    with reversion.create_revision():
        reversion.set_user(request.user)
        reversion.set_comment(_("Certification du groupe"))
        updated_count = 0
        try:
            for group in groups:
                group.certification_date = now
                group.save()
                send_newly_certified_group_notifications.delay(group.pk)
                subscribe_supportgroup_referents_to_main_newsletters.delay(group.pk)
                updated_count += 1
        except Exception as e:
            modeladmin.message_user(
                request,
                str(e),
                level=messages.WARNING,
            )
        else:
            modeladmin.message_user(
                request,
                ngettext(
                    "Le groupe a été certifié.",
                    f"{updated_count} groupes ont été certifiés",
                    updated_count,
                ),
            )


@admin.display(description="Décertifier les groupes sélectionnés")
def uncertify_supportgroups(modeladmin, request, qs):
    groups = qs.certified().select_for_update()
    with reversion.create_revision():
        reversion.set_user(request.user)
        reversion.set_comment(_("Décértification du groupe"))
        updated_count = 0
        try:
            for group in groups:
                group.certification_date = None
                group.save()
                # Temporarily disable the notification
                # send_uncertified_group_notifications.delay(group.pk)
                updated_count += 1
        except Exception as e:
            modeladmin.message_user(
                request,
                str(e),
                level=messages.WARNING,
            )
        else:
            modeladmin.message_user(
                request,
                ngettext(
                    "Le groupe a été décertifié.",
                    f"{updated_count} groupes ont été décertifiés",
                    updated_count,
                ),
            )
