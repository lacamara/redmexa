from datetime import timedelta

from django.core.management import BaseCommand
from django.utils import timezone

from agir.events.actions.notifications import event_report_form_reminder_notification
from agir.events.models import Event


class Command(BaseCommand):
    help = "Send the organizers of events a reminder to fill the event report form"

    def handle(self, **kwargs):
        today = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday = today - timedelta(days=1)

        yesterday_event_pks = (
            Event.objects.public()
            .filter(
                end_time__gte=yesterday,
                end_time__lt=today,
                subtype__report_person_form__isnull=False,
            )
            .values_list("pk", flat=True)
        )

        if len(yesterday_event_pks) > 0:
            self.stdout.write(
                f"Sending report form reminder for {len(yesterday_event_pks)} event(s) ended yesterday ({yesterday})."
            )
            for event_pk in yesterday_event_pks:
                event_report_form_reminder_notification(event_pk)
        else:
            self.stdout.write(
                f"No form report found for events that ended yesterday ({yesterday})."
            )

        self.stdout.write("Done!")
