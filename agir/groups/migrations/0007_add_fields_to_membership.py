# Generated by Django 3.1.13 on 2021-10-11 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("groups", "0006_uuid_in_image_filename"),
    ]

    operations = [
        migrations.AddField(
            model_name="membership",
            name="default_subscriptions_enabled",
            field=models.BooleanField(
                default=True,
                help_text="J'accepte de recevoir les notifications par défaut de ce groupe. Je pourrai changer mes préferences de notifications à tout moment. ",
                verbose_name="Ajout des notifications par défaut du groupe après création",
            ),
        ),
        migrations.AddField(
            model_name="membership",
            name="personal_information_sharing_consent",
            field=models.BooleanField(
                help_text="J'accepte de partager mes informations personnelles avec les animateur·ices et gestionnaires de ce groupe",
                null=True,
                verbose_name="Consentement au partage des informations personnelles avec les animateur·ices et gestionnaires du groupe",
            ),
        ),
    ]
