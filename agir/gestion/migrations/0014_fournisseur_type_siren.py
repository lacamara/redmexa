# Generated by Django 3.1.14 on 2022-02-04 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0013_ajout_type_depense_salaire"),
    ]

    operations = [
        migrations.AddField(
            model_name="fournisseur",
            name="siren",
            field=models.CharField(
                blank=True, max_length=14, verbose_name="SIREN/SIRET"
            ),
        ),
        migrations.AddField(
            model_name="fournisseur",
            name="type",
            field=models.CharField(
                choices=[("M", "Personne morale"), ("P", "Personne physique")],
                default="M",
                max_length=1,
                verbose_name="Type de fournisseur",
            ),
        ),
        migrations.AlterField(
            model_name="document",
            name="type",
            field=models.CharField(
                choices=[
                    ("DEV", "Devis"),
                    ("CON", "Contrat"),
                    ("FAC", "Facture"),
                    ("FAC-AVO", "Facture d'avoir"),
                    ("BDL", "Bon de livraison"),
                    ("JUS", "Justificatif de dépense"),
                    ("JUS-BIL", "Billet de train"),
                    ("JUS-TRAIN", "Justificatif de train"),
                    ("JUS-CEM", "Carte d'embarquement"),
                    ("PAY", "Preuve de paiement"),
                    ("PAY-CHK", "Scan du chèque"),
                    ("PAY-TKT", "Ticket de caisse"),
                    ("EXA", "Exemplaire fourni"),
                    ("EXA-BAT", "BAT"),
                    ("EXA-TRA", "Tract"),
                    ("EXA-AFF", "Affiche"),
                    ("EXA-CAP", "Capture d'écran"),
                    ("PHO", "Photographie de l'objet ou de l'événement"),
                    ("AUT", "Autre (à détailler dans les commentaires)"),
                    ("ATT", "Attestation"),
                    ("ATT-GRA", "Attestation de gratuité"),
                    ("ATT-CON", "Attestation de concours en nature"),
                    ("ATT-REG", "Attestation de réglement des consommations"),
                    (
                        "ATT-ESP",
                        "Demande d'autorisation d'occupation de l'espace public",
                    ),
                ],
                max_length=10,
                verbose_name="Type de document",
            ),
        ),
    ]
