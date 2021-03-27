import re
from datetime import datetime, timedelta
from unittest import mock

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.core import mail
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.reverse import reverse

from agir.clients.models import Client
from agir.lib.http import add_query_params_to_url
from agir.lib.utils import generate_token_params
from agir.people.models import Person, generate_referrer_id
from agir.people.tasks import send_confirmation_email


class WordpressClientMixin:
    def setUp(self):
        self.wordpress_client = Client.objects.create_client(client_id="wordpress")
        self.unauthorized_client = Client.objects.create_client(
            client_id="unauthorized"
        )

        person_content_type = ContentType.objects.get_for_model(Person)
        view_permission = Permission.objects.get(
            content_type=person_content_type, codename="view_person"
        )
        add_permission = Permission.objects.get(
            content_type=person_content_type, codename="add_person"
        )
        change_permission = Permission.objects.get(
            content_type=person_content_type, codename="change_person"
        )

        self.wordpress_client.role.user_permissions.add(
            view_permission, add_permission, change_permission
        )
        self.client.force_login(self.wordpress_client.role)


class APISubscriptionTestCase(WordpressClientMixin, TestCase):
    @mock.patch("agir.people.serializers.send_confirmation_email")
    def test_can_subscribe_with_old_api(self, patched_send_confirmation_mail):
        data = {"email": "guillaume@email.com", "location_zip": "75004"}

        response = self.client.post(
            reverse("legacy:person-subscribe"),
            data=data,
            HTTP_X_WORDPRESS_CLIENT="192.168.0.1",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        patched_send_confirmation_mail.delay.assert_called_once()
        self.assertEqual(
            patched_send_confirmation_mail.delay.call_args[1],
            {"location_country": "FR", "type": "LFI", **data},
        )

    def test_cannot_subscribe_with_old_api_and_unauthorized_client(self):
        self.client.force_login(self.unauthorized_client.role)
        data = {"email": "guillaume@email.com", "location_zip": "75004"}

        response = self.client.post(
            reverse("legacy:person-subscribe"),
            data=data,
            HTTP_X_WORDPRESS_CLIENT="192.168.0.1",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cannot_subscribe_without_client_ip_on_old_api(self):
        data = {"email": "guillaume@email.com", "location_zip": "75004"}

        response = self.client.post(reverse("legacy:person-subscribe"), data=data)

        self.assertEqual(response.status_code, 403)

    @mock.patch("agir.people.serializers.send_confirmation_email")
    def test_can_subscribe_with_new_api(self, send_confirmation_email):
        data = {
            "email": "ragah@fez.com",
            "first_name": "Jim",
            "last_name": "Ballade",
            "location_zip": "75001",
            "contact_phone": "06 98 45 78 45",
            "type": "NSP",
            "referrer": generate_referrer_id(),
        }
        response = self.client.post(reverse("api_people_subscription"), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        send_confirmation_email.delay.assert_called_once()
        self.assertEqual(
            send_confirmation_email.delay.call_args[1],
            {**data, "location_country": "FR", "contact_phone": "+33698457845"},
        )

    def test_cannot_subscribe_with_new_api_and_unauthorized_client(self):
        self.client.force_login(self.unauthorized_client.role)
        data = {
            "email": "ragah@fez.com",
            "first_name": "Jim",
            "last_name": "Ballade",
            "location_zip": "75001",
            "contact_phone": "06 98 45 78 45",
            "type": "NSP",
            "referrer": generate_referrer_id(),
        }
        response = self.client.post(reverse("api_people_subscription"), data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @mock.patch("agir.people.serializers.send_confirmation_email")
    def test_can_subscribe_to_new_type_with_existing_person(
        self, send_confirmation_email
    ):
        person = Person.objects.create_insoumise(
            email="type@boite.pays", first_name="Marc", location_zip="75001"
        )

        data = {
            "email": person.email,
            "first_name": "Marco",
            "last_name": "Polo",
            "location_zip": "75004",
            "contact_phone": "",
            "type": "NSP",
        }
        response = self.client.post(reverse("api_people_subscription"), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        send_confirmation_email.assert_not_called()

        person.refresh_from_db()
        self.assertTrue(person.is_2022)
        self.assertEqual(person.first_name, "Marc")
        self.assertEqual(person.last_name, "Polo")
        self.assertEqual(person.location_zip, "75001")


class SubscriptionConfirmationTestCase(TestCase):
    def test_can_receive_mail_and_confirm_subscription(self):
        data = {"email": "guillaume@email.com", "location_zip": "75001"}

        send_confirmation_email(**data)

        self.assertEqual(len(mail.outbox), 1)

        confirmation_url = reverse("subscription_confirm")
        match = re.search(confirmation_url + r'\?[^" \n)]+', mail.outbox[0].body)

        self.assertIsNotNone(match)
        url_with_params = match.group(0)

        response = self.client.get(url_with_params)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertTrue(
            response.url.startswith("https://lafranceinsoumise.fr/bienvenue/",)
        )

        # check that the person has been created
        Person.objects.get_by_natural_key("guillaume@email.com")

    def test_can_receive_specific_email_if_already_subscribed(self):
        p = Person.objects.create_insoumise("person@server.fr")

        data = {"email": "person@server.fr", "location_zip": "75001"}

        send_confirmation_email(**data)

        self.assertEqual(len(mail.outbox), 1)
        self.assertRegex(mail.outbox[0].body, r"vous êtes déjà avec nous !")

    def test_can_subscribe_with_nsp(self):
        data = {
            "email": "personne@organisation.pays",
            "location_zip": "20322",
            "location_country": "VE",
            "type": "NSP",
        }
        send_confirmation_email(**data)

        self.assertEqual(len(mail.outbox), 1)

        confirmation_url = reverse("subscription_confirm")
        match = re.search(confirmation_url + r'\?[^" \n)]+', mail.outbox[0].body)

        self.assertIsNotNone(match)
        url_with_params = match.group(0)

        response = self.client.get(url_with_params)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        # check that the person has been created
        p = Person.objects.get_by_natural_key("personne@organisation.pays")
        self.assertTrue(p.is_2022)
        self.assertEqual(p.location_country, "VE")
        self.assertAlmostEqual(
            datetime.fromisoformat(p.meta["subscriptions"]["NSP"]["date"]),
            timezone.now(),
            delta=timedelta(seconds=1),
        )


class ManageNewslettersAPIViewTestCase(WordpressClientMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.person = Person.objects.create_person(
            email="a@b.c",
            newsletters=[Person.NEWSLETTER_LFI, Person.NEWSLETTER_2022_EN_LIGNE],
            create_role=True,
        )

    def test_can_modify_current_newsletters(self):
        res = self.client.post(
            reverse("api_people_newsletters"),
            data=(
                {
                    "id": str(self.person.id),
                    "newsletters": {
                        Person.NEWSLETTER_2022: True,
                        Person.NEWSLETTER_2022_EN_LIGNE: False,
                    },
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.person.refresh_from_db()
        self.assertCountEqual(
            self.person.newsletters, [Person.NEWSLETTER_LFI, Person.NEWSLETTER_2022]
        )

    def test_cannot_modify_while_anonymous(self):
        self.client.logout()
        res = self.client.post(
            reverse("api_people_newsletters"),
            data=(
                {
                    "id": str(self.person.id),
                    "newsletters": {
                        Person.NEWSLETTER_2022: True,
                        Person.NEWSLETTER_2022_EN_LIGNE: False,
                    },
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_modify_while_connected_as_same_person(self):
        self.client.force_login(self.person.role)
        res = self.client.post(
            reverse("api_people_newsletters"),
            data=(
                {
                    "id": str(self.person.id),
                    "newsletters": {
                        Person.NEWSLETTER_2022: True,
                        Person.NEWSLETTER_2022_EN_LIGNE: False,
                    },
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class RetrievePersonAPIViewTestCase(WordpressClientMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.person = Person.objects.create_person(
            email="a@b.c", first_name="A", last_name="B", create_role=True
        )
        self.other_person = Person.objects.create_person(
            email="m@n.o", create_role=True
        )

    def test_can_retrieve_person_information(self):
        res = self.client.get(f"{reverse('api_people_retrieve')}?id={self.person.id}")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_can_retrieve_person_information_with_login_link(self):
        self.client.logout()
        params = generate_token_params(self.person)
        url = add_query_params_to_url(
            reverse("api_people_retrieve"),
            {"id": str(self.person.id), "no_session": "o", **params},
        )
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_can_retrieve_while_connected_as_same_person(self):
        self.client.force_login(self.person.role)
        res = self.client.get(f"{reverse('api_people_retrieve')}?id={self.person.id}")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_cannot_retrieve_while_connected_as_different_person(self):
        self.client.force_login(self.other_person.role)
        res = self.client.get(f"{reverse('api_people_retrieve')}?id={self.person.id}")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_cannot_retrieve_while_anonymous(self):
        self.client.logout()
        res = self.client.get(f"{reverse('api_people_retrieve')}?id={self.person.id}")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
