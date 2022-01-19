# Generated by Django 3.1.14 on 2022-01-18 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0012_date_releve_reglement"),
    ]

    operations = [
        migrations.AlterField(
            model_name="depense",
            name="type",
            field=models.CharField(
                choices=[
                    ("AFM", "Achats de fournitures et marchandises"),
                    ("AFM-B", "Achats de fourniture de bureau"),
                    ("AFM-G", "Achats de goodies"),
                    ("FBC", "Frais bancaires"),
                    ("FDV", "Frais divers"),
                    ("FRH", "Frais de réception et d'hébergement"),
                    ("FRH-H", "Frais d'hébergement"),
                    ("FRH-A", "Frais de restauration"),
                    ("HEC", "Honoraires de l'expert comptable"),
                    ("HCC", "Honoraires et conseils en communication"),
                    ("HCC-G", "Graphisme et maquettage"),
                    ("HCC-C", "Conseil en communication"),
                    ("IMM", "Location ou mise à disposition immobilière"),
                    ("IMM-S", "Mise à disposition d'une salle"),
                    ("IMM-L", "Loyers de location"),
                    ("PAU", "Production audiovisuelle"),
                    ("PIM", "Publication et impression (hors R39)"),
                    ("REU", "Frais divers liées aux réunions publiques"),
                    ("TRA", "Transports et déplacement"),
                    ("TRA-T", "Billets de train"),
                    ("TRA-A", "Billets d'avion"),
                    ("TRA-L", "Location d'un véhicule"),
                    ("TRA-K", "Frais kilométriques"),
                    ("SAL", "Salaires"),
                    ("REF", "Refacturation"),
                ],
                max_length=5,
                verbose_name="Type de dépense",
            ),
        ),
    ]