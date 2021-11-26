# Generated by Django 3.1.13 on 2021-11-26 12:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0011_personform_short_description"),
        ("events", "0013_rename_legal_meta"),
    ]

    operations = [
        migrations.AddField(
            model_name="eventsubtype",
            name="report_person_form",
            field=models.ForeignKey(
                blank=True,
                help_text="Les organisateur·ices des événements de ce type seront invité·es à remplir ce formulaire une fois l'événement terminé",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="event_subtype",
                related_query_name="event_subtype",
                to="people.personform",
                verbose_name="Formulaire de bilan",
            ),
        ),
    ]
