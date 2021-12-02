# Generated by Django 3.1.13 on 2021-09-08 10:18

from django.db import migrations, models

SUBSCRIPTION_PUSH = "push"
SUBSCRIPTION_EMAIL = "email"
TYPE_NEW_COMMENT = "new-comment"
TYPE_NEW_COMMENT_RESTRICTED = "new-comment-restricted"


def add_new_comment_restricted_subscriptions(apps, schema_editor):
    Subscription = apps.get_model("notifications", "Subscription")
    push_subscriptions = [
        Subscription(
            type=SUBSCRIPTION_PUSH,
            activity_type=TYPE_NEW_COMMENT_RESTRICTED,
            membership_id=s["membership_id"],
            person_id=s["person_id"],
        )
        for s in Subscription.objects.filter(
            type=SUBSCRIPTION_PUSH,
            activity_type=TYPE_NEW_COMMENT,
        ).values("membership_id", "person_id")
    ]
    email_subscriptions = [
        Subscription(
            type=SUBSCRIPTION_EMAIL,
            activity_type=TYPE_NEW_COMMENT_RESTRICTED,
            membership_id=s["membership_id"],
            person_id=s["person_id"],
        )
        for s in Subscription.objects.filter(
            type=SUBSCRIPTION_EMAIL,
            activity_type=TYPE_NEW_COMMENT,
        ).values("membership_id", "person_id")
    ]
    Subscription.objects.bulk_create(
        push_subscriptions + email_subscriptions, ignore_conflicts=True
    )


def remove_new_comment_restricted_subscriptions(apps, schema_editor):
    Subscription = apps.get_model("notifications", "Subscription")
    Subscription.objects.filter(activity_type=TYPE_NEW_COMMENT_RESTRICTED).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("notifications", "0013_add_new-follower_notification"),
    ]

    operations = [
        migrations.AlterField(
            model_name="subscription",
            name="activity_type",
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
                ],
                max_length=50,
                verbose_name="Type",
            ),
        ),
        migrations.RunPython(
            add_new_comment_restricted_subscriptions,
            remove_new_comment_restricted_subscriptions,
            atomic=True,
        ),
    ]
