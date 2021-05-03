# Generated by Django 3.1.8 on 2021-04-30 14:54

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0004_display_name_and_image"),
        ("gestion", "0006_participation_precisions"),
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
                ],
                "verbose_name": "Compte",
                "verbose_name_plural": "Comptes",
            },
        ),
        migrations.AddField(
            model_name="depense",
            name="niveau_acces",
            field=models.CharField(
                choices=[
                    ("N", "Sans restriction"),
                    ("R", "Restreint"),
                    ("S", "Secret"),
                ],
                default="N",
                max_length=1,
                verbose_name="Niveau d'accès",
            ),
        ),
        migrations.AddField(
            model_name="depense",
            name="validation",
            field=models.IntegerField(
                choices=[
                    (0, "Pas encore de validation"),
                    (1, "Validation organisateur"),
                    (2, "Validation financière"),
                ],
                default=0,
                verbose_name="Validation du dossier de la dépense",
            ),
        ),
        migrations.AddField(
            model_name="projet",
            name="niveau_acces",
            field=models.CharField(
                choices=[
                    ("N", "Sans restriction"),
                    ("R", "Restreint"),
                    ("S", "Secret"),
                ],
                default="N",
                max_length=1,
                verbose_name="Niveau d'accès",
            ),
        ),
        migrations.RemoveField(model_name="depense", name="commentaires",),
        migrations.RemoveField(model_name="document", name="commentaires",),
        migrations.AlterField(
            model_name="document",
            name="type",
            field=models.CharField(
                choices=[
                    ("DEV", "Devis"),
                    ("FAC", "Facture"),
                    ("JUS", "Justificatif de dépense"),
                    ("PAY", "Preuve de paiement"),
                    ("GRA", "Attestation de gratuité"),
                    ("EXA", "Exemplaire fourni"),
                    ("PHO", "Photographie de l'objet ou de l'événement"),
                    ("AUT", "Autre (à détailler dans les commentaires)"),
                ],
                max_length=10,
                verbose_name="Type de document",
            ),
        ),
        migrations.RemoveField(model_name="projet", name="commentaires",),
        migrations.CreateModel(
            name="Commentaire",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="date de création",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(
                        auto_now=True, verbose_name="dernière modification"
                    ),
                ),
                (
                    "auteur_nom",
                    models.CharField(
                        help_text="Pour pouvoir afficher un nom si la personne a été supprimée.",
                        max_length=200,
                        verbose_name="Nom de l'auteur",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("R", "Remarque"),
                            ("W", "Point de vigilance"),
                            ("T", "À faire"),
                        ],
                        max_length=1,
                        verbose_name="Type de commentaire",
                    ),
                ),
                ("texte", models.TextField(verbose_name="Texte du commentaire")),
                (
                    "cache",
                    models.BooleanField(
                        default=False, verbose_name="Commentaire caché"
                    ),
                ),
                (
                    "auteur",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to="people.person",
                        verbose_name="Auteur⋅ice",
                    ),
                ),
            ],
            options={"ordering": ("created",),},
        ),
        migrations.AddField(
            model_name="depense",
            name="commentaires",
            field=models.ManyToManyField(
                help_text="Ces commentaires permettent d'ajouter de garder la trace des opérations de traitement des différentes pièces.",
                to="gestion.Commentaire",
                verbose_name="Commentaires",
            ),
        ),
        migrations.AddField(
            model_name="document",
            name="commentaires",
            field=models.ManyToManyField(
                help_text="Ces commentaires permettent d'ajouter de garder la trace des opérations de traitement des différentes pièces.",
                to="gestion.Commentaire",
                verbose_name="Commentaires",
            ),
        ),
        migrations.AddField(
            model_name="projet",
            name="commentaires",
            field=models.ManyToManyField(
                help_text="Ces commentaires permettent d'ajouter de garder la trace des opérations de traitement des différentes pièces.",
                to="gestion.Commentaire",
                verbose_name="Commentaires",
            ),
        ),
    ]
