import datetime
from copy import deepcopy

import pytz
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from agir.event_requests.models import EventRequest, EventAsset
from agir.event_requests.tasks import (
    send_event_request_validation_emails,
    send_new_publish_event_asset_notification,
)
from agir.events.models import Calendar
from agir.events.models import Event
from agir.events.tasks import (
    send_event_creation_notification,
    geocode_event,
)
from agir.groups.models import SupportGroup
from agir.groups.tasks import notify_new_group_event, send_new_group_event_email
from agir.people.models import Person


def create_calendar_for_object(obj):
    if not hasattr(obj, "calendar"):
        return

    if hasattr(obj, "event_theme_type"):
        parent_id = obj.event_theme_type.calendar_id
        name = f"{obj.name} ({obj.event_theme_type.name})"
        slug = slugify(f"e-{obj.event_theme_type.id}-{obj.name}")[:50]
    else:
        parent_id = None
        name = obj.name
        slug = slugify(f"e-{obj.name}")[:50]

    calendar, _ = Calendar.objects.get_or_create(
        slug=slug,
        defaults={
            "name": name,
            "user_contributed": False,
            "parent_id": parent_id,
            "archived": True,
        },
    )

    obj.calendar_id = calendar.id
    obj.save()


def schedule_new_event_tasks(event_request):
    event = event_request.event
    organizer_config = event.organizer_configs.only("pk").first()
    organizer_group = event.organizers_groups.only("pk").first()

    geocode_event.delay(event.pk)

    if organizer_config:
        send_event_creation_notification.delay(organizer_config.pk)

    if organizer_group:
        notify_new_group_event.delay(organizer_group.pk, event.pk)
        send_new_group_event_email.delay(organizer_group.pk, event.pk)

    send_event_request_validation_emails.delay(event_request.pk)


def create_event_from_event_speaker_request(event_speaker_request=None):
    event_request = event_speaker_request.event_request
    event_speaker = event_speaker_request.event_speaker
    event_theme = event_request.event_theme
    event_theme_type = event_theme.event_theme_type
    event_subtype = event_theme_type.event_subtype

    start_time = event_speaker_request.datetime
    data = deepcopy(event_request.event_data)

    organizer_person = None
    organizer_group = None

    if "organizer_person_id" in data:
        organizer_person = Person.objects.filter(
            pk=data.pop("organizer_person_id")
        ).first()

    if "organizer_group_id" in data:
        organizer_group = (
            SupportGroup.objects.active()
            .filter(pk=data.pop("organizer_group_id"))
            .first()
        )

    tz = data.pop("timezone", None)
    if tz not in pytz.all_timezones:
        tz = timezone.get_default_timezone().zone

    duration = int(data.pop("duration", 1))
    end_time = start_time + datetime.timedelta(hours=duration)

    data["location_zip"] = event_request.location_zip
    data["location_city"] = event_request.location_city
    data["location_country"] = str(event_request.location_country)

    data["name"] = (
        f"{event_theme_type.name} "
        f"sur le thème '{event_theme.name}' "
        f"avec {event_speaker.person.get_full_name()}"
    )

    data = {
        k: v for k, v in data.items() if k in [f.name for f in Event._meta.get_fields()]
    }

    event = Event.objects.create(
        visibility=Event.VISIBILITY_PUBLIC,
        organizer_person=organizer_person,
        organizer_group=organizer_group,
        event_speaker=event_speaker,
        start_time=start_time,
        end_time=end_time,
        timezone=tz,
        subtype=event_subtype,
        **data,
    )

    if event_theme_type.calendar:
        event_theme_type.calendar.events.add(event)

    if event_theme.calendar:
        event_theme.calendar.events.add(event)

    for event_asset_template in event_theme.get_event_asset_templates():
        EventAsset.objects.create(
            template=event_asset_template,
            event=event,
            extra_data={
                "event_theme": event_theme.name,
                "event_theme_type": event_theme_type.name,
            },
        )

    return event


def create_event_request_from_personform_submission(submission, do_not_create=False):
    submission_data = deepcopy(submission.data)
    event_data = {
        "from_personform": submission.form_id,
        "from_personform_submission_id": submission.id,
        "organizer_person_id": submission_data.pop(
            "organizer_person_id", str(submission.person_id)
        ),
        "contact_hide_phone": submission_data.pop("contact_hide_phone", True),
        **submission_data,
    }
    event_request_data = {
        "datetimes": event_data.pop("datetimes", None),
        "event_theme_id": event_data.pop("event_theme", None),
        "location_zip": event_data.pop("location_zip", None),
        "location_city": event_data.pop("location_city", None),
        "location_country": event_data.pop("location_country", None),
        "comment": event_data.pop("comment", ""),
        "event_data": event_data,
    }
    if do_not_create:
        return EventRequest(**event_request_data)

    with transaction.atomic():
        event_request = EventRequest.objects.create(**event_request_data)
        submission.data["event_request_id"] = event_request.id
        submission.save()

        return event_request


def publish_event_assets(event_assets):
    event_assets = event_assets.filter(published=False)
    event_ids = set(event_assets.values_list("event_id", flat=True))
    result = event_assets.update(published=True)
    for event_id in event_ids:
        send_new_publish_event_asset_notification.delay(str(event_id))
    return result


def unpublish_event_assets(event_assets):
    return event_assets.filter(published=True).update(published=False)
