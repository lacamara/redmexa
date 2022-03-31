# Generated by Django 3.2.12 on 2022-03-15 17:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0020_auto_20220310_1835"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="compte",
            options={
                "permissions": [
                    (
                        "acces_contenu_restreint",
                        "Voir les projets, dépenses et documents dont l'accès est indiqué comme restreint.",
                    ),
                    (
                        "acces_contenu_secret",
                        "Voir les projets, dépenses et documents dont l'accès est indiqué commme secret.",
                    ),
                    ("engager_depense", "Engager une dépense pour ce compte"),
                    ("gerer_depense", "Gérer les dépenses après engagement"),
                    ("controler_depense", "Contrôler les dépenses a posteriori"),
                    ("validation_depense", "Validation comptable des dépenses"),
                    ("voir_montant_depense", "Voir le montant des dépenses finalisées"),
                    ("gerer_projet", "Gérer les projets"),
                    ("controler_projet", "Contrôler les projets"),
                ],
                "verbose_name": "Compte",
                "verbose_name_plural": "Comptes",
            },
        ),
    ]