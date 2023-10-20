from django.test import TestCase
from django.core import mail

from agir.people.actions.subscription import SUBSCRIPTION_TYPE_CAMPAIGN
from agir.people.models import Person
from agir.people import tasks


class PeopleTasksTestCase(TestCase):
    def setUp(self):
        self.person = Person.objects.create_insoumise("me@me.org", create_role=True)

    def test_welcome_mail(self):
        tasks.send_welcome_mail(self.person.pk, type=SUBSCRIPTION_TYPE_CAMPAIGN)

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].recipients(), [self.person.email])

    def test_unsubscribe_mail(self):
        tasks.send_unsubscribe_email(self.person.pk)

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].recipients(), [self.person.email])

    def test_inactive_user_dont_receive_mail(self):
        person = Person.objects.create_insoumise(
            "inactiverole@me.org", create_role=True
        )
        person.role.is_active = False
        person.role.save()
        tasks.send_welcome_mail(person.pk, type=SUBSCRIPTION_TYPE_CAMPAIGN)

        self.assertEqual(len(mail.outbox), 0)

    def test_no_role_user_receive_mail(self):
        person = Person.objects.create_insoumise(
            "inactiverole@me.org", create_role=False
        )
        person.save()
        tasks.send_welcome_mail(person.pk, type=SUBSCRIPTION_TYPE_CAMPAIGN)

        self.assertEqual(len(mail.outbox), 1)
