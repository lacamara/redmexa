# Generated by Django 3.1.13 on 2021-10-20 11:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0007_add_person_image_filename_cache_key"),
    ]

    operations = [
        migrations.CreateModel(
            name="Contact",
            fields=[],
            options={
                "proxy": True,
                "indexes": [],
                "constraints": [],
            },
            bases=("people.person",),
        ),
    ]
