# Generated by Django 3.2.13 on 2022-06-18 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0038_projet_code_insee"),
    ]

    operations = [
        migrations.AlterField(
            model_name="document",
            name="type",
            field=models.CharField(
                choices=[
                    ("DEV", "Devis"),
                    ("CON", "Contrat"),
                    ("AVO", "Avoir"),
                    ("FAC", "Facture"),
                    ("FAC-BUL", "Bulletin de paie"),
                    ("FAC-ND", "Note de débit"),
                    ("BDL", "Bon de livraison"),
                    ("JUS", "Justificatif de dépense"),
                    ("JUS-BIL", "Billet de train"),
                    ("JUS-TRAIN", "Justificatif de train"),
                    ("JUS-CEM", "Carte d'embarquement"),
                    ("PAY", "Preuve de paiement"),
                    ("PAY-CHK", "Scan du chèque"),
                    ("PAY-TKT", "Ticket de caisse"),
                    ("PAY-VIR", "Ordre de virement"),
                    ("PAY-REL", "Extrait du relevé"),
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
                    ("ATT-REG", "Attestation de règlement des consommations"),
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
