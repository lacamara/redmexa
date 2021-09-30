# Generated by Django 3.1.13 on 2021-09-30 12:18

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("groups", "0006_uuid_in_image_filename"),
        ("people", "0005_add_subscriptions"),
        ("events", "0010_uuid_in_image_filename"),
    ]

    operations = [
        migrations.CreateModel(
            name="Invitation",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="date de création",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(
                        auto_now=True, verbose_name="dernière modification"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "En attente"),
                            ("accepted", "Acceptée"),
                            ("refused", "Refusée"),
                        ],
                        default="pending",
                        max_length=20,
                        verbose_name="status",
                    ),
                ),
                (
                    "timestamp",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        verbose_name="Date de l'invitation",
                    ),
                ),
                (
                    "event",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="invitations",
                        to="events.event",
                        verbose_name="Evenement de l'invitation",
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="invitations",
                        to="groups.supportgroup",
                        verbose_name="Groupe invité à l'événement",
                    ),
                ),
                (
                    "person_request",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="people.person",
                        verbose_name="Personne qui émet l'invitation",
                    ),
                ),
                (
                    "person_response",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="invitation_response",
                        to="people.person",
                        verbose_name="Personne qui répond à l'invitation",
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="invitation",
            constraint=models.UniqueConstraint(
                fields=("person_request", "event", "group"), name="unique"
            ),
        ),
    ]
