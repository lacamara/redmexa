# Generated by Django 3.2.16 on 2023-01-25 10:12

import agir.lib.form_fields
import agir.lib.models
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import django_countries.fields
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("events", "0023_event_location_departement_id"),
        ("people", "0020_person_location_departement_id"),
    ]

    operations = [
        migrations.CreateModel(
            name="EventRequest",
            fields=[
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
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                (
                    "status",
                    models.IntegerField(
                        choices=[
                            (0, "Demande en cours"),
                            (1, "Demande traitée"),
                            (2, "Demande annulée"),
                        ],
                        default=0,
                        verbose_name="état de la demande",
                    ),
                ),
                (
                    "datetimes",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.DateTimeField(),
                        size=None,
                        verbose_name="dates possibles",
                    ),
                ),
                (
                    "location_zip",
                    models.CharField(max_length=20, verbose_name="code postal"),
                ),
                (
                    "location_city",
                    models.CharField(max_length=100, verbose_name="ville"),
                ),
                (
                    "location_country",
                    django_countries.fields.CountryField(
                        blank=True, default="FR", max_length=2, verbose_name="pays"
                    ),
                ),
                (
                    "event_data",
                    models.JSONField(
                        blank=True,
                        default=dict,
                        encoder=agir.lib.form_fields.CustomJSONEncoder,
                        help_text="Les données qui seront utilisées pour créer l'événement au moment de la validation",
                        verbose_name="Paramètres de l'événement",
                    ),
                ),
                ("comment", models.TextField(blank=True, verbose_name="Commentaire")),
                (
                    "event",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="event_request",
                        related_query_name="event_request",
                        to="events.event",
                        verbose_name="événement",
                    ),
                ),
            ],
            options={
                "verbose_name": "Demande d'événement",
                "verbose_name_plural": "Demandes d'évenement",
            },
        ),
        migrations.CreateModel(
            name="EventSpeaker",
            fields=[
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
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                (
                    "available",
                    models.BooleanField(
                        default=True,
                        help_text="Cette personne est disponible pour recevoir des demandes d'événement",
                        verbose_name="Disponible",
                    ),
                ),
            ],
            options={
                "verbose_name": "Intervenant·e",
                "verbose_name_plural": "Intervenant·es",
            },
        ),
        migrations.CreateModel(
            name="EventThemeType",
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
                ("name", models.CharField(max_length=255, verbose_name="nom")),
                (
                    "event_subtype",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="+",
                        to="events.eventsubtype",
                        verbose_name="sous-type d'événement lié",
                    ),
                ),
            ],
            options={
                "verbose_name": "Type de thème d'événement",
                "verbose_name_plural": "Types de thème d'évenement",
            },
        ),
        migrations.CreateModel(
            name="EventTheme",
            fields=[
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
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                ("name", models.CharField(max_length=255, verbose_name="nom")),
                (
                    "description",
                    agir.lib.models.DescriptionField(
                        blank=True, verbose_name="description"
                    ),
                ),
                (
                    "event_theme_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="event_themes",
                        related_query_name="event_theme",
                        to="event_requests.eventthemetype",
                        verbose_name="type de thème d'événement",
                    ),
                ),
            ],
            options={
                "verbose_name": "Thème d'événement",
                "verbose_name_plural": "Thèmes d'évenement",
            },
        ),
        migrations.CreateModel(
            name="EventSpeakerRequest",
            fields=[
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
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                (
                    "available",
                    models.BooleanField(
                        default=None,
                        help_text="L'intervenant·e est disponible ou non",
                        null=True,
                        verbose_name="disponible",
                    ),
                ),
                (
                    "accepted",
                    models.BooleanField(
                        default=False,
                        help_text="L'intervenant·e a été confirmé·e ou pas pour cette demande",
                        verbose_name="confirmé·e",
                    ),
                ),
                ("datetime", models.DateTimeField(verbose_name="date")),
                ("comment", models.TextField(blank=True, verbose_name="Commentaire")),
                (
                    "event_request",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="event_speaker_requests",
                        related_query_name="event_speaker_request",
                        to="event_requests.eventrequest",
                        verbose_name="demande d'événement",
                    ),
                ),
                (
                    "event_speaker",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="event_speaker_requests",
                        related_query_name="event_speaker_request",
                        to="event_requests.eventspeaker",
                        verbose_name="intervenant·e",
                    ),
                ),
            ],
            options={
                "verbose_name": "Demande de disponibilité d'intervenant·e",
                "verbose_name_plural": "Demandes de disponibilité d'intervenant·e",
                "ordering": ("datetime",),
            },
        ),
        migrations.AddField(
            model_name="eventspeaker",
            name="event_requests",
            field=models.ManyToManyField(
                through="event_requests.EventSpeakerRequest",
                to="event_requests.EventRequest",
            ),
        ),
        migrations.AddField(
            model_name="eventspeaker",
            name="event_themes",
            field=models.ManyToManyField(
                related_name="event_speakers",
                related_query_name="event_speaker",
                to="event_requests.EventTheme",
                verbose_name="thèmes",
            ),
        ),
        migrations.AddField(
            model_name="eventspeaker",
            name="person",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="event_speaker",
                to="people.person",
                verbose_name="personne",
            ),
        ),
        migrations.AddField(
            model_name="eventrequest",
            name="event_theme",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="event_requests",
                related_query_name="event_request",
                to="event_requests.eventtheme",
                verbose_name="thème",
            ),
        ),
        migrations.AddIndex(
            model_name="eventspeakerrequest",
            index=models.Index(
                fields=["datetime"], name="event_reque_datetim_0f2a3b_idx"
            ),
        ),
        migrations.AddConstraint(
            model_name="eventspeakerrequest",
            constraint=models.UniqueConstraint(
                fields=("event_request", "event_speaker", "datetime"),
                name="unique_for_request_speaker_datetime",
            ),
        ),
    ]