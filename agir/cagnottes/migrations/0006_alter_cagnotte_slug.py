# Generated by Django 3.2.17 on 2023-02-10 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cagnottes", "0005_cagnotte_meta"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cagnotte",
            name="slug",
            field=models.SlugField(
                help_text="Utilisé dans l'URL pour cette cagnotte", unique=True
            ),
        ),
    ]
