from django.conf import settings

from agir.authentication.tokens import monthly_donation_confirmation_token_generator
from agir.donations.models import SpendingRequest
from agir.lib.celery import (
    emailing_task,
)
from agir.lib.mailing import send_mosaico_email, send_template_email
from agir.lib.utils import front_url
from agir.payments.types import PAYMENT_TYPES
from agir.people.models import Person
from agir.system_pay.models import SystemPaySubscription


# DONATIONS


@emailing_task(post_save=True)
def send_donation_email(person_pk, payment_type):
    person = Person.objects.prefetch_related("emails").get(pk=person_pk)
    template_code = "DONATION_MESSAGE"
    email_from = settings.EMAIL_FROM

    if (
        payment_type in PAYMENT_TYPES
        and hasattr(PAYMENT_TYPES[payment_type], "email_from")
        and PAYMENT_TYPES[payment_type].email_from
    ):
        email_from = PAYMENT_TYPES[payment_type].email_from

    if (
        payment_type in PAYMENT_TYPES
        and hasattr(PAYMENT_TYPES[payment_type], "email_template_code")
        and PAYMENT_TYPES[payment_type].email_template_code
    ):
        template_code = PAYMENT_TYPES[payment_type].email_template_code

    if template_code.endswith("html"):
        send_template_email(
            template_name=template_code,
            from_email=email_from,
            bindings={"profil": front_url("personal_information")},
            recipients=[person],
        )
    else:
        send_mosaico_email(
            code=template_code,
            subject="Merci d'avoir donné !",
            from_email=email_from,
            bindings={"PROFILE_LINK": front_url("personal_information")},
            recipients=[person],
        )


@emailing_task()
def send_monthly_donation_confirmation_email(
    *,
    data,
    confirmation_view_name="monthly_donation_confirm",
    email_template="donations/confirmation_email.html",
    from_email=settings.EMAIL_FROM_CAMPAIGN,
):
    data = data.copy()
    email = data.pop("email")

    query_params = {
        "email": email,
        **{k: v for k, v in data.items() if v is not None},
    }
    query_params["token"] = monthly_donation_confirmation_token_generator.make_token(
        **query_params
    )

    confirmation_link = front_url(confirmation_view_name, query=query_params)

    send_template_email(
        template_name=email_template,
        from_email=from_email,
        bindings={"lien_confirmation": confirmation_link},
        recipients=[email],
    )


@emailing_task(post_save=True)
def send_expiration_email_reminder(sp_subscription_pk):
    sp_subscription = SystemPaySubscription.objects.select_related(
        "subscription__person", "alias"
    ).get(pk=sp_subscription_pk)

    send_mosaico_email(
        code="CARD_EXPIRATION",
        subject="Mettez à jour votre carte bancaire !",
        from_email=settings.EMAIL_FROM,
        bindings={
            "subscription_description": sp_subscription.subscription.description,
            "renew_subscription_link": front_url("view_payments"),
            "expiry_date": sp_subscription.alias.expiry_date,
        },
        recipients=[sp_subscription.subscription.person],
    )


# SPENDING REQUESTS
SPENDING_REQUEST_NOTIFICATION_TEMPLATES = {
    SpendingRequest.Status.AWAITING_PEER_REVIEW: "spending_requests/email/group_awaiting_peer_review_notification.html",
    SpendingRequest.Status.AWAITING_ADMIN_REVIEW: {
        SpendingRequest.Status.AWAITING_PEER_REVIEW: "spending_requests/email/group_awaiting_admin_review_notification.html"
    },
    SpendingRequest.Status.AWAITING_SUPPLEMENTARY_INFORMATION: "spending_requests/email/group_awaiting_supplementary_information_notification.html",
    SpendingRequest.Status.TO_PAY: "spending_requests/email/group_to_pay_notification.html",
    SpendingRequest.Status.PAID: "spending_requests/email/group_paid_notification.html",
    SpendingRequest.Status.REFUSED: "spending_requests/email/group_refused_notification.html",
}


@emailing_task(post_save=True)
def spending_request_notify_admin(
    spending_request_pk, to_status=None, from_status=None, person_pk=None
):
    spending_request = SpendingRequest.objects.select_related("group").get(
        pk=spending_request_pk
    )

    send_template_email(
        template_name="spending_requests/email/admin_notification.html",
        recipients=[settings.EMAIL_EQUIPE_FINANCE],
        bindings={
            "spending_request": spending_request,
            "person": person_pk and Person.objects.filter(pk=person_pk).first(),
            "from_status": from_status and SpendingRequest.Status(from_status),
        },
    )


@emailing_task(post_save=True)
def spending_request_notify_group_managers(
    spending_request_pk, to_status=None, from_status=None, person_pk=None, comment=""
):
    spending_request = SpendingRequest.objects.select_related("group").get(
        pk=spending_request_pk
    )

    to_status = to_status or spending_request.status
    template_name = SPENDING_REQUEST_NOTIFICATION_TEMPLATES.get(to_status, None)

    if isinstance(template_name, dict):
        template_name = from_status and template_name.get(from_status, None)

    if not template_name:
        return

    send_template_email(
        template_name=template_name,
        recipients=spending_request.group.finance_managers,
        bindings={
            "spending_request": spending_request,
            "person": person_pk and Person.objects.filter(pk=person_pk).first(),
            "from_status": from_status and SpendingRequest.Status(from_status),
            "comment": comment,
            "group_finance_management_url": front_url(
                "view_group_settings_finance",
                kwargs={"pk": spending_request.group.pk},
                absolute=True,
            ),
        },
    )
