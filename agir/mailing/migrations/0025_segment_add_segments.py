# Generated by Django 2.2.14 on 2020-07-01 15:59

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mailing", "0024_segment_forms"),
    ]

    operations = [
        migrations.AddField(
            model_name="segment",
            name="add_segments",
            field=models.ManyToManyField(
                related_name="_segment_add_segments_+",
                to=settings.NUNTIUS_SEGMENT_MODEL,
                verbose_name="Ajouter les personnes membres des segments suivants",
            ),
        ),
    ]
