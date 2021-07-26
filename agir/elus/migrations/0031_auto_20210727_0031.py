# Generated by Django 3.1.13 on 2021-07-26 22:31

from django.db import migrations, models
import django.db.models.deletion
import dynamic_filenames


class Migration(migrations.Migration):

    dependencies = [
        ('data_france', '0029_deputes_europeens'),
        ('elus', '0030_auto_20210726_1656'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rechercheparrainage',
            name='formulaire',
            field=models.FileField(blank=True, null=True, upload_to=dynamic_filenames.FilePattern(filename_pattern='elus/parrainages/{uuid:.30base32}{ext}'), verbose_name='Formulaire de promesse signé'),
        ),
        migrations.AlterField(
            model_name='rechercheparrainage',
            name='maire',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parrainages', related_query_name='parrainage', to='data_france.elumunicipal', verbose_name='Maire'),
        ),
    ]
