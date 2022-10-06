# Generated by Django 3.2.12 on 2022-04-13 17:33

import agir.lib.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("polls", "0017_auto_20201021_1525"),
    ]

    operations = [
        migrations.AddField(
            model_name="poll",
            name="unauthorized_message",
            field=agir.lib.models.DescriptionField(
                blank=True,
                default="",
                help_text="Note montrée à tout utilisateur qui n'aurait pas le tag nécessaire pour afficher le formulaire.",
                verbose_name="Note pour les personnes non autorisées",
            ),
        ),
    ]