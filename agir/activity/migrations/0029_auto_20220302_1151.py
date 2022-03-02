# Generated by Django 3.2.12 on 2022-03-02 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("activity", "0028_add-TYPE_REMINDER_UPCOMING_EVENT_START"),
    ]

    operations = [
        migrations.AlterField(
            model_name="activity",
            name="type",
            field=models.CharField(
                choices=[
                    ("waiting-payment", "Paiement en attente"),
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
                ],
                max_length=50,
                verbose_name="Type",
            ),
        ),
    ]
