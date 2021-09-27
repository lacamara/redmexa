# Generated by Django 3.1.13 on 2021-09-24 10:37

import django.core.validators
from django.db import migrations
import dynamic_filenames
import stdimage.models


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0009_event_subtype_gestion_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="image",
            field=stdimage.models.StdImageField(
                blank=True,
                help_text="Vous pouvez ajouter une image de bannière : elle apparaîtra sur la page, et sur les réseaux sociaux en cas de partage. Préférez une image à peu près deux fois plus large que haute. Elle doit faire au minimum 1200 pixels de large et 630 de haut pour une qualité optimale.",
                upload_to=dynamic_filenames.FilePattern(
                    filename_pattern="{app_label}/{model_name}/{instance.id}/banner/{uuid:base32}{ext}"
                ),
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["jpg", "jpeg", "gif", "png", "svg"]
                    )
                ],
                verbose_name="image",
            ),
        ),
        migrations.AlterField(
            model_name="eventsubtype",
            name="default_image",
            field=stdimage.models.StdImageField(
                blank=True,
                help_text="L'image associée par défaut à un événement de ce sous-type.",
                upload_to=dynamic_filenames.FilePattern(
                    filename_pattern="{app_label}/{model_name}/{instance.id}/banner/{uuid:base32}{ext}"
                ),
                verbose_name="image par défaut",
            ),
        ),
    ]
