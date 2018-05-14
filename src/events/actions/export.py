import csv
from operator import attrgetter
import bleach
from html import unescape
from django.utils.timezone import get_default_timezone
from django.conf import settings
from django.urls import reverse

from lib.export import dicts_to_csv_lines
from api import front_urls


__all__ = ['events_to_csv', 'events_to_csv_lines']


COMMON_FIELDS = ['name', 'published', 'contact_email', 'contact_phone', 'description', 'start_time', 'end_time']
ADRESS_FIELDS = ['location_name', 'location_address1', 'location_zip', 'location_city']
LINK_FIELDS = ['link', 'admin_link']

FIELDS = COMMON_FIELDS + ['address', 'animators'] + LINK_FIELDS

common_extractor = attrgetter(*COMMON_FIELDS)
address_parts_extractor = attrgetter(*ADRESS_FIELDS)

initiator_extractor = attrgetter('first_name', 'last_name', 'contact_phone', 'email')

address_template = "{}, {}, {} {}"
initiator_template = "{} {} {} <{}>"


def events_to_csv(queryset, output, timezone=None):
    w = csv.DictWriter(output, fieldnames=FIELDS)
    w.writeheader()
    w.writerows(events_to_dicts(queryset, timezone))


def events_to_csv_lines(queryset, timezone=None):
    return dicts_to_csv_lines(events_to_dicts(queryset, timezone), FIELDS)


def events_to_dicts(queryset, timezone=None):
    if timezone is None:
        timezone = get_default_timezone()

    for e in queryset.iterator():
        d = {k: v for k, v in zip(COMMON_FIELDS, common_extractor(e))}

        d['start_time'] = d['start_time'].astimezone(timezone).strftime('%d/%m %H:%M')
        d['end_time'] = d['end_time'].astimezone(timezone).strftime('%d/%m %H:%M')

        d['description'] = unescape(bleach.clean(d['description'].replace('<br />', '\n'), tags=[], strip=True))

        d['address'] = address_template.format(*address_parts_extractor(e))

        d['animators'] = ' / '.join(
            initiator_template.format(*initiator_extractor(og.person)).strip() for og in e.organizer_configs.all())

        d['link'] = settings.FRONT_DOMAIN + reverse('manage_event', urlconf=front_urls, args=[e.id])
        d['admin_link'] = settings.API_DOMAIN + reverse('admin:events_event_change', args=[e.id])

        yield d
