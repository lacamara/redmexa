# Generated by Django 3.2.20 on 2023-11-08 19:09

from django.db import migrations
import django_countries.fields


class Migration(migrations.Migration):
    dependencies = [
        ("gestion", "0044_fournisseur_location_departement_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="reglement",
            name="location_country_fournisseur",
            field=django_countries.fields.CountryField(
                default="MX", max_length=2, verbose_name="pays"
            ),
        ),
    ]
