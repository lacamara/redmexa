# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-05 14:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='oauth_enabled',
            field=models.BooleanField(default=False, help_text="Indique si ce client peut obtenir des tokens d'accès OAuth pour le compte d'un utilisateur.", verbose_name='client OAuth'),
        ),
    ]
