# Generated by Django 3.2.18 on 2023-05-04 15:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0031_eventsubtype_is_coorganizable"),
        ("people", "0025_person_action_radius"),
        ("groups", "0017_supportgroup_certification_date"),
        ("activity", "0032_auto_20230504_1034"),
    ]

    operations = [
        migrations.AlterField(
            model_name="activity",
            name="announcement",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="activities",
                related_query_name="activity",
                to="activity.announcement",
            ),
        ),
        migrations.AlterField(
            model_name="activity",
            name="event",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="notifications",
                related_query_name="notification",
                to="events.event",
            ),
        ),
        migrations.AlterField(
            model_name="activity",
            name="individual",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="+",
                to="people.person",
            ),
        ),
        migrations.AlterField(
            model_name="activity",
            name="push_announcement",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="activities",
                related_query_name="activity",
                to="activity.pushannouncement",
            ),
        ),
        migrations.AlterField(
            model_name="activity",
            name="supportgroup",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="notifications",
                related_query_name="notification",
                to="groups.supportgroup",
            ),
        ),
        migrations.AlterField(
            model_name="activity",
            name="type",
            field=models.CharField(
                choices=[
                    ("waiting-payment", "Paiement en attente"),
                    (
                        "new-event-participation-mygroups",
                        "Le groupe participe à un événement",
                    ),
                    ("group-invitation", "Invitation à un groupe"),
                    ("new-follower", "Nouveau·lle abonné·e dans le groupe"),
                    ("new-member", "Nouveau membre dans le groupe"),
                    (
                        "member-status-changed",
                        "Un membre actif du groupe a été passé au statut abonné·e",
                    ),
                    (
                        "group-membership-limit-reminder",
                        "Les membres du groupes sont de plus en plus nombreux",
                    ),
                    ("new-message", "Nouveau message dans un de vos groupes"),
                    ("new-comment", "Nouveau commentaire dans un de vos groupes"),
                    (
                        "new-comment-restricted",
                        "Nouveau commentaire dans une de vos discussions",
                    ),
                    ("waiting-location-group", "Préciser la localisation du groupe"),
                    (
                        "waiting-location-event",
                        "Préciser la localisation d'un événement",
                    ),
                    ("new-event-speaker-request", "Nouvelle demande d'événement reçue"),
                    (
                        "group-coorganization-invite",
                        "Invitation à coorganiser un événement reçue",
                    ),
                    (
                        "group-coorganization-accepted",
                        "Invitation à coorganiser un événement acceptée",
                    ),
                    (
                        "group-coorganization-accepted-from",
                        "Invitation de leur groupe à coorganiser mon événement acceptée",
                    ),
                    (
                        "group-coorganization-accepted-to",
                        "Invitation de mon groupe à coorganiser leur événement acceptée",
                    ),
                    ("group-info-update", "Mise à jour des informations du groupe"),
                    (
                        "accepted-invitation-member",
                        "Invitation à rejoindre un groupe acceptée",
                    ),
                    ("new-attendee", "Un nouveau participant à votre événement"),
                    (
                        "new-group-attendee",
                        "Un nouveau groupe participant à votre événement",
                    ),
                    ("event-update", "Mise à jour d'un événement"),
                    ("new-event-mygroups", "Votre groupe organise un événement"),
                    ("new-report", "Nouveau compte-rendu d'événement"),
                    ("cancelled-event", "Événement annulé"),
                    ("referral-accepted", "Personne parrainée"),
                    ("announcement", "Associée à une annonce"),
                    (
                        "transferred-group-member",
                        "Un membre d'un groupe a été transferé vers un autre groupe",
                    ),
                    (
                        "new-members-through-transfer",
                        "De nouveaux membres ont été transferés vers le groupe",
                    ),
                    ("group-creation-confirmation", "Groupe créé"),
                    ("event-suggestion", "Événement suggéré"),
                    (
                        "reminder-docs-event-eve",
                        "Rappel à la veille d'un événement des documents à envoyer",
                    ),
                    (
                        "reminder-docs-event-nextday",
                        "Rappel au lendemain d'un événement des documents à envoyer",
                    ),
                    (
                        "reminder-report-form-for-event",
                        "Rappel au lendemain d'un événement de l'éventuel formulaire de bilan à remplir",
                    ),
                    (
                        "reminder-upcoming-event-start",
                        "Rappel du début imminent d'un événement pour les participants",
                    ),
                    (
                        "uncertifiable-group-warning",
                        "Avertissement aux animateur·ices d'un groupe certifié qui ne respecte plus les critères de certification",
                    ),
                ],
                max_length=50,
                verbose_name="Type",
            ),
        ),
    ]
