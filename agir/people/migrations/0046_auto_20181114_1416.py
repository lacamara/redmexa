# Generated by Django 2.1.3 on 2018-11-14 13:16
import agir.lib.form_fields
import agir.people.person_forms.models
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("people", "0045_auto_20181106_1504")]

    operations = [
        migrations.AddField(
            model_name="personform",
            name="editable",
            field=models.BooleanField(
                default=False,
                verbose_name="Les répondant⋅e⋅s peuvent modifier leurs réponses",
            ),
        ),
        migrations.AlterField(
            model_name="personformsubmission",
            name="data",
            field=django.contrib.postgres.fields.jsonb.JSONField(
                default=dict,
                editable=False,
                encoder=agir.lib.form_fields.CustomJSONEncoder,
                verbose_name="Données",
            ),
        ),
    ]
