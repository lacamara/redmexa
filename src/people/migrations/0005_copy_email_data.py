# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-07-28 15:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0004_create_email_model'),
    ]

    operations = [
        migrations.RunSQL("""
            INSERT INTO people_personemail (address, bounced, bounced_date, person_id)
            SELECT email, bounced, bounced_date, id FROM people_person
            """)
    ]
