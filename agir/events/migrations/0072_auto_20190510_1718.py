# Generated by Django 2.2 on 2019-05-10 15:18

import agir.events.models
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import re


class Migration(migrations.Migration):

    dependencies = [("events", "0071_jitsimeeting")]

    operations = [
        migrations.AddField(
            model_name="event",
            name="enable_jitsi",
            field=models.BooleanField(
                default=False, verbose_name="Activer la visio-conférence"
            ),
        ),
        migrations.AddField(
            model_name="rsvp",
            name="jitsi_meeting",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="rsvps",
                to="events.JitsiMeeting",
            ),
        ),
        migrations.AlterField(
            model_name="jitsimeeting",
            name="domain",
            field=models.CharField(
                default=agir.events.models.JitsiMeeting.choose_domain, max_length=255
            ),
        ),
        migrations.AlterField(
            model_name="jitsimeeting",
            name="event",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="jitsi_meetings",
                to="events.Event",
            ),
        ),
        migrations.AlterField(
            model_name="jitsimeeting",
            name="room_name",
            field=models.CharField(
                default=agir.events.models.JitsiMeeting.generate_room_name,
                max_length=255,
                unique=True,
                validators=[
                    django.core.validators.RegexValidator(
                        re.compile("^[a-z0-9-_]+$"),
                        "Seulement des lettres minuscules, des chiffres, des _ et des -.",
                        "invalid",
                    )
                ],
            ),
        ),
    ]
