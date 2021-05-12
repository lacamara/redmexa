# Generated by Django 3.1.3 on 2020-12-17 15:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("activity", "0010_auto_20201215_1818")]

    operations = [
        migrations.AlterField(
            model_name="activity",
            name="type",
            field=models.CharField(
                choices=[
                    ("waiting-payment", "Paiement en attente"),
                    ("group-invitation", "Invitation à un groupe"),
                    ("new-member", "Nouveau membre dans le groupe"),
                    (
                        "group-membership-limit-reminder",
                        "Les membres du groupes sont de plus en plus nombreux",
                    ),
                    ("waiting-location-group", "Préciser la localisation du groupe"),
                    (
                        "group-coorganization-invite",
                        "Invitation à coorganiser un groupe reçue",
                    ),
                    (
                        "waiting-location-event",
                        "Préciser la localisation d'un événement",
                    ),
                    (
                        "group-coorganization-accepted",
                        "Invitation à coorganiser un groupe acceptée",
                    ),
                    ("group-info-update", "Mise à jour des informations du groupe"),
                    (
                        "accepted-invitation-member",
                        "Invitation à rejoindre un groupe acceptée",
                    ),
                    ("new-attendee", "Un nouveau participant à votre événement"),
                    ("event-update", "Mise à jour d'un événement"),
                    ("new-event-mygroups", "Votre groupe organise un événement"),
                    ("new-report", "Nouveau compte-rendu d'événement"),
                    ("new-event-aroundme", "Nouvel événement près de chez moi"),
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
                ],
                max_length=50,
                verbose_name="Type",
            ),
        )
    ]
