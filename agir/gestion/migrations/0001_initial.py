# Generated by Django 3.1.6 on 2021-02-16 17:03

import agir.gestion.models
import agir.lib.model_fields
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import django_countries.fields
import dynamic_filenames
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("events", "0002_objets_initiaux_et_recherche"),
    ]

    operations = [
        migrations.CreateModel(
            name="Compte",
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
                    "designation",
                    models.CharField(
                        max_length=5, unique=True, verbose_name="Désignation courte"
                    ),
                ),
                (
                    "nom",
                    models.CharField(
                        max_length=200, verbose_name="Nom complet du compte"
                    ),
                ),
                (
                    "description",
                    models.TextField(blank=True, verbose_name="Description"),
                ),
            ],
            options={"verbose_name": "Compte", "verbose_name_plural": "Comptes",},
        ),
        migrations.CreateModel(
            name="Document",
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
                    "numero",
                    models.CharField(
                        default=agir.gestion.models.numero_unique,
                        editable=False,
                        help_text="Numéro unique pour identifier chaque objet sur la plateforme.",
                        max_length=7,
                        unique=True,
                        verbose_name="Numéro unique",
                    ),
                ),
                (
                    "commentaires",
                    models.JSONField(
                        default=list,
                        help_text="Ces commentaires permettent d'ajouter de garder la trace des opérations de traitement des différentes pièces.",
                        verbose_name="Commentaires",
                    ),
                ),
                (
                    "titre",
                    models.CharField(
                        help_text="Titre permettant d'identifier le document",
                        max_length=200,
                        verbose_name="Titre du document",
                    ),
                ),
                (
                    "identifiant",
                    models.CharField(
                        help_text="Indiquez ici si ce document a un identifiant ou un numéro (numéro de facture ou de devis, identifiant de transaction, etc.)",
                        max_length=100,
                        verbose_name="Identifiant ou numéro externe",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("FAC", "Facture"),
                            ("JUS", "Justificatif de dépense"),
                            ("DEV", "Devis"),
                            ("PAY", "Preuve de paiement"),
                            ("AUT", "Autre (à détailler dans les commentaires)"),
                        ],
                        max_length=10,
                        verbose_name="Type de document",
                    ),
                ),
                (
                    "statut",
                    models.CharField(
                        choices=[
                            ("COR", "Document à corriger"),
                            ("INA", "Document à vérifier"),
                            ("CON", "Document confirmé"),
                        ],
                        max_length=3,
                        verbose_name="Statut du document",
                        default="INA",
                    ),
                ),
                (
                    "requis",
                    models.CharField(
                        choices=[
                            ("NEC", "Strictement nécessaire"),
                            ("PRE", "Préférable"),
                            ("IGN", "Peut être ignoré"),
                        ],
                        max_length=3,
                        verbose_name="Obligatoire ?",
                    ),
                ),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        help_text="Toute description complémentaire nécessaire pour identifier clairement le document (et le rechercher)",
                        verbose_name="Description du document",
                    ),
                ),
                (
                    "fichier",
                    models.FileField(
                        null=True,
                        upload_to=dynamic_filenames.FilePattern(
                            filename_pattern="gestion/documents/{uuid:.2base32}/{uuid}{ext}"
                        ),
                        verbose_name="Fichier du document",
                    ),
                ),
            ],
            options={
                "verbose_name": "Document justificatif",
                "verbose_name_plural": "Documents justificatifs",
            },
        ),
        migrations.CreateModel(
            name="Fournisseur",
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
                    "coordinates",
                    django.contrib.gis.db.models.fields.PointField(
                        blank=True,
                        geography=True,
                        null=True,
                        srid=4326,
                        verbose_name="coordonnées",
                    ),
                ),
                (
                    "coordinates_type",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (0, "Coordonnées manuelles"),
                            (10, "Coordonnées automatiques précises"),
                            (
                                20,
                                "Coordonnées automatiques approximatives (niveau rue)",
                            ),
                            (
                                25,
                                "Coordonnées automatique approximatives (arrondissement)",
                            ),
                            (30, "Coordonnées automatiques approximatives (ville)"),
                            (50, "Coordonnées automatiques (qualité inconnue)"),
                            (254, "Pas de position géographique"),
                            (255, "Coordonnées introuvables"),
                        ],
                        editable=False,
                        help_text="Comment les coordonnées ci-dessus ont-elle été acquises",
                        null=True,
                        verbose_name="type de coordonnées",
                    ),
                ),
                (
                    "location_name",
                    models.CharField(
                        blank=True, max_length=255, verbose_name="nom du lieu"
                    ),
                ),
                (
                    "location_address1",
                    models.CharField(
                        blank=True, max_length=100, verbose_name="adresse (1ère ligne)"
                    ),
                ),
                (
                    "location_address2",
                    models.CharField(
                        blank=True, max_length=100, verbose_name="adresse (2ème ligne)"
                    ),
                ),
                (
                    "location_citycode",
                    models.CharField(
                        blank=True, max_length=20, verbose_name="code INSEE"
                    ),
                ),
                (
                    "location_city",
                    models.CharField(blank=True, max_length=100, verbose_name="ville"),
                ),
                (
                    "location_zip",
                    models.CharField(
                        blank=True, max_length=20, verbose_name="code postal"
                    ),
                ),
                (
                    "location_state",
                    models.CharField(blank=True, max_length=40, verbose_name="état"),
                ),
                (
                    "location_country",
                    django_countries.fields.CountryField(
                        blank=True, default="FR", max_length=2, verbose_name="pays"
                    ),
                ),
                (
                    "nom",
                    models.CharField(max_length=100, verbose_name="Nom du fournisseur"),
                ),
                (
                    "commentaires",
                    models.TextField(verbose_name="Commentaires", default=list),
                ),
                (
                    "iban",
                    agir.lib.model_fields.IBANField(
                        allowed_countries=None,
                        blank=True,
                        max_length=34,
                        verbose_name="IBAN du fournisseur",
                    ),
                ),
                (
                    "contact_phone",
                    phonenumber_field.modelfields.PhoneNumberField(
                        blank=True,
                        max_length=128,
                        region=None,
                        verbose_name="Numéro de téléphone",
                    ),
                ),
                (
                    "contact_email",
                    models.EmailField(
                        blank=True, max_length=254, verbose_name="Adresse email"
                    ),
                ),
            ],
            options={"abstract": False,},
        ),
        migrations.CreateModel(
            name="Projet",
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
                    "numero",
                    models.CharField(
                        default=agir.gestion.models.numero_unique,
                        editable=False,
                        help_text="Numéro unique pour identifier chaque objet sur la plateforme.",
                        max_length=7,
                        unique=True,
                        verbose_name="Numéro unique",
                    ),
                ),
                (
                    "commentaires",
                    models.JSONField(
                        default=list,
                        help_text="Ces commentaires permettent d'ajouter de garder la trace des opérations de traitement des différentes pièces.",
                        verbose_name="Commentaires",
                    ),
                ),
                (
                    "titre",
                    models.CharField(max_length=40, verbose_name="Titre du projet"),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("REU", "Réunion publique"),
                            ("MAN", "Manifestation publique"),
                            ("RH", "Dépenses RH mensuelles"),
                        ],
                        max_length=10,
                        verbose_name="Type de projet",
                    ),
                ),
                (
                    "statut",
                    models.CharField(
                        choices=[
                            ("DFI", "Demande de financement"),
                            ("ECO", "En cours de constitution"),
                            ("FIN", "Finalisé par le secrétariat"),
                            ("REN", "Renvoyé par l'équipe financière"),
                        ],
                        max_length=3,
                        verbose_name="Statut",
                    ),
                ),
                (
                    "description",
                    models.TextField(null=True, verbose_name="Description du projet"),
                ),
                ("details", models.JSONField(default=dict, verbose_name="Détails")),
                (
                    "event",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="events.event",
                        verbose_name="Événement sur la plateforme",
                    ),
                ),
            ],
            options={"verbose_name": "Projet", "verbose_name_plural": "Projets",},
        ),
        migrations.CreateModel(
            name="Depense",
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
                    "numero",
                    models.CharField(
                        default=agir.gestion.models.numero_unique,
                        editable=False,
                        help_text="Numéro unique pour identifier chaque objet sur la plateforme.",
                        max_length=7,
                        unique=True,
                        verbose_name="Numéro unique",
                    ),
                ),
                (
                    "commentaires",
                    models.JSONField(
                        default=list,
                        help_text="Ces commentaires permettent d'ajouter de garder la trace des opérations de traitement des différentes pièces.",
                        verbose_name="Commentaires",
                    ),
                ),
                (
                    "titre",
                    models.CharField(
                        help_text="Une description sommaire de la nature de la dépense",
                        max_length=100,
                        verbose_name="Titre de la dépense",
                    ),
                ),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        help_text="La description doit permettre de pouvoir identifier de façon non ambigue la dépense et sa nature dans le cas où le titre ne suffit pas.",
                        verbose_name="Description",
                    ),
                ),
                (
                    "montant",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="Montant de la dépense",
                    ),
                ),
                (
                    "paiement",
                    models.BooleanField(default=False, verbose_name="Dépense payée"),
                ),
                (
                    "nom_fournisseur",
                    models.CharField(
                        max_length=100, verbose_name="Nom du fournisseur", default=""
                    ),
                ),
                (
                    "iban_fournisseur",
                    agir.lib.model_fields.IBANField(
                        allowed_countries=None,
                        blank=True,
                        max_length=34,
                        verbose_name="IBAN du fournisseur",
                    ),
                ),
                (
                    "contact_phone_fournisseur",
                    phonenumber_field.modelfields.PhoneNumberField(
                        blank=True,
                        max_length=128,
                        region=None,
                        verbose_name="Numéro de téléphone",
                    ),
                ),
                (
                    "contact_email_fournisseur",
                    models.EmailField(
                        blank=True, max_length=254, verbose_name="Adresse email"
                    ),
                ),
                (
                    "compte",
                    models.ForeignKey(
                        help_text="Le compte dont fait partie cette dépense.",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="depenses",
                        related_query_name="depense",
                        to="gestion.compte",
                    ),
                ),
                (
                    "documents",
                    models.ManyToManyField(
                        related_name="_depense_documents_+", to="gestion.Document"
                    ),
                ),
                (
                    "fournisseur",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="gestion.fournisseur",
                    ),
                ),
                (
                    "projet",
                    models.ForeignKey(
                        help_text="Le projet éventuel auquel est rattaché cette dépense.",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="depenses",
                        related_query_name="depense",
                        to="gestion.projet",
                    ),
                ),
            ],
            options={"verbose_name": "Dépense", "verbose_name_plural": "Dépenses",},
        ),
    ]
