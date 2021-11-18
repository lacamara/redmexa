from functools import partial

from django.db import transaction

from agir.activity.models import Activity
from agir.groups.models import SupportGroup, Membership
from agir.groups.tasks import (
    GROUP_MEMBERSHIP_LIMIT_NOTIFICATION_STEPS,
    send_joined_notification_email,
    send_alert_capacity_email,
    send_message_notification_email,
    send_comment_notification_email,
)
from agir.notifications.models import Subscription


@transaction.atomic()
def someone_joined_notification(membership, membership_count=1):
    recipients = membership.supportgroup.managers
    activity_type = (
        Activity.TYPE_NEW_MEMBER
        if membership.is_active_member
        else Activity.TYPE_NEW_FOLLOWER
    )
    Activity.objects.bulk_create(
        [
            Activity(
                type=activity_type,
                recipient=r,
                supportgroup=membership.supportgroup,
                individual=membership.person,
                meta={"email": membership.person.email},
            )
            for r in recipients
        ],
        send_post_save_signal=True,
    )

    if not membership.is_active_member:
        return

    membership_limit_notication_steps = [
        membership.supportgroup.MEMBERSHIP_LIMIT + step
        for step in GROUP_MEMBERSHIP_LIMIT_NOTIFICATION_STEPS
        if membership.supportgroup.MEMBERSHIP_LIMIT + step > 0
    ]

    if (
        membership.supportgroup.type == SupportGroup.TYPE_LOCAL_GROUP
        and membership_count in membership_limit_notication_steps
    ):
        current_membership_limit_notification_step = membership_limit_notication_steps.index(
            membership_count
        )
        Activity.objects.bulk_create(
            [
                Activity(
                    type=Activity.TYPE_GROUP_MEMBERSHIP_LIMIT_REMINDER,
                    recipient=r,
                    supportgroup=membership.supportgroup,
                    status=Activity.STATUS_UNDISPLAYED,
                    meta={
                        "membershipLimit": membership.supportgroup.MEMBERSHIP_LIMIT,
                        "membershipCount": membership_count,
                        "membershipLimitNotificationStep": current_membership_limit_notification_step,
                    },
                )
                for r in recipients
            ],
            send_post_save_signal=True,
        )
    if (
        membership.supportgroup.type == SupportGroup.TYPE_LOCAL_GROUP
        and membership_count
        in [
            21,
            # 30, (Temporarily disabled)
        ]
    ):
        transaction.on_commit(
            partial(
                send_alert_capacity_email.delay,
                membership.supportgroup.pk,
                membership_count,
            )
        )

    transaction.on_commit(partial(send_joined_notification_email.delay, membership.pk))


@transaction.atomic()
def new_message_notifications(message):
    recipients = message.supportgroup.members.all()
    Activity.objects.bulk_create(
        [
            Activity(
                individual=message.author,
                supportgroup=message.supportgroup,
                type=Activity.TYPE_NEW_MESSAGE,
                recipient=r,
                status=Activity.STATUS_UNDISPLAYED,
                meta={"message": str(message.pk),},
            )
            for r in recipients
            if r.pk != message.author.pk
        ],
        send_post_save_signal=True,
    )

    send_message_notification_email.delay(message.pk)


@transaction.atomic()
def new_message_organization_notifications(message):
    recipients = message.supportgroup.referents + [message.person]
    Activity.objects.bulk_create(
        [
            Activity(
                individual=message.author,
                supportgroup=message.supportgroup,
                type=Activity.TYPE_NEW_MESSAGE,
                recipient=r,
                status=Activity.STATUS_UNDISPLAYED,
                meta={"message": str(message.pk),},
            )
            for r in recipients
            if r.pk != message.author.pk
        ],
        send_post_save_signal=True,
    )

    # send_message_notification_email.delay(message.pk)


@transaction.atomic()
def new_comment_notifications(comment):
    comment_authors = list(comment.message.comments.values_list("author_id", flat=True))
    comment_authors = set(comment_authors + [comment.message.author_id])

    participant_recipients = comment.message.supportgroup.members.exclude(
        id=comment.author.id
    ).filter(
        notification_subscriptions__membership__supportgroup=comment.message.supportgroup,
        notification_subscriptions__person__in=comment_authors,
        notification_subscriptions__type=Subscription.SUBSCRIPTION_PUSH,
        notification_subscriptions__activity_type=Activity.TYPE_NEW_COMMENT_RESTRICTED,
    )

    Activity.objects.bulk_create(
        [
            Activity(
                individual=comment.author,
                supportgroup=comment.message.supportgroup,
                type=Activity.TYPE_NEW_COMMENT_RESTRICTED,
                recipient=r,
                status=Activity.STATUS_UNDISPLAYED,
                meta={"message": str(comment.message.pk), "comment": str(comment.pk),},
            )
            for r in participant_recipients
        ],
        send_post_save_signal=True,
    )

    other_recipients = (
        comment.message.supportgroup.members.exclude(id=comment.author.id)
        .exclude(id__in=participant_recipients.values_list("id", flat=True))
        .filter(
            notification_subscriptions__membership__supportgroup=comment.message.supportgroup,
            notification_subscriptions__type=Subscription.SUBSCRIPTION_PUSH,
            notification_subscriptions__activity_type=Activity.TYPE_NEW_COMMENT,
        )
    )

    Activity.objects.bulk_create(
        [
            Activity(
                individual=comment.author,
                supportgroup=comment.message.supportgroup,
                type=Activity.TYPE_NEW_COMMENT,
                recipient=r,
                status=Activity.STATUS_UNDISPLAYED,
                meta={"message": str(comment.message.pk), "comment": str(comment.pk),},
            )
            for r in other_recipients
        ],
        send_post_save_signal=True,
    )

    send_comment_notification_email.delay(comment.pk)


@transaction.atomic()
def member_to_follower_notification(membership):
    Activity.objects.create(
        type=Activity.TYPE_MEMBER_STATUS_CHANGED,
        recipient=membership.person,
        supportgroup=membership.supportgroup,
    )
