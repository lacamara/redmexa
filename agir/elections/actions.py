from functools import partial

from django.db import transaction

from agir.elections.models import PollingStationOfficer
from agir.elections.tasks import send_new_polling_station_officer_to_campaign_manager
from agir.lib.tasks import geocode_person
from agir.people.actions.subscription import (
    SUBSCRIPTIONS_EMAILS,
    SUBSCRIPTION_TYPE_PLATFORM,
)
from agir.people.models import Person

UPDATABLE_PERSON_FIELDS = (
    "date_of_birth",
    "contact_phone",
    "location_address1",
    "location_address2",
    "location_zip",
    "location_city",
    "location_country",
)


def create_or_update_polling_station_officer(data):
    data["available_voting_dates"] = list(data.get("available_voting_dates"))
    email = data.pop("contact_email").lower()

    person_data = {
        "first_name": data.get("first_name", None),
        "last_name": data.get("last_name", None),
        "date_of_birth": data.get("birth_date", None),
        "contact_phone": data.get("contact_phone", ""),
        "location_address1": data.get("location_address1", None),
        "location_address2": data.get("location_address2", None),
        "location_zip": data.get("location_zip", None),
        "location_city": data.get("location_city", None),
        "location_country": data.get("location_country", None),
    }
    person_data = {key: value for key, value in person_data.items() if value}

    with transaction.atomic():
        is_new_person = False
        try:
            person = Person.objects.get_by_natural_key(email)
            for key, value in person_data.items():
                if key in UPDATABLE_PERSON_FIELDS:
                    setattr(person, key, person_data[key])
            person.save()
        except Person.DoesNotExist:
            is_new_person = True
            person = Person.objects.create_person(email=email, **person_data)

        (
            polling_station_officer,
            created,
        ) = PollingStationOfficer.objects.update_or_create(
            person_id=person.pk, defaults={**data, "contact_email": email}
        )

        transaction.on_commit(partial(geocode_person.delay, person.pk))
        transaction.on_commit(
            partial(
                send_new_polling_station_officer_to_campaign_manager.delay,
                polling_station_officer.id,
            )
        )

        if (
            is_new_person
            and "welcome" in SUBSCRIPTIONS_EMAILS[SUBSCRIPTION_TYPE_PLATFORM]
        ):
            from agir.people.tasks import send_welcome_mail

            transaction.on_commit(
                partial(send_welcome_mail.delay, person.pk, SUBSCRIPTION_TYPE_PLATFORM)
            )

        data.update(
            {
                "id": polling_station_officer.id,
                "updated": not created,
                "person_id": person.id,
                "contact_email": email,
            }
        )

        return data
