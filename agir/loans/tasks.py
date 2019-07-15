import smtplib
import socket
import subprocess
from pathlib import Path

from celery import shared_task
from django.conf import settings
from django.utils import timezone
from slugify import slugify

from agir.loans.actions import save_pdf_contract, SUBSTITUTIONS
from agir.payments.models import Payment
from agir.payments.types import PAYMENT_TYPES
from agir.lib.mailing import send_mosaico_email


@shared_task(bind=True)
def generate_contract(self, payment_id, force=False):
    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
        return None

    payment_type = PAYMENT_TYPES.get(payment.type)
    if payment_type is None:
        return None

    contract_path = payment_type.contract_path(payment)

    if not force and payment.status != Payment.STATUS_COMPLETED:
        raise ValueError(f"Paiement n°{payment_id} n'a pas été terminé.")

    if not force and ("contract_path" in payment.meta):
        return payment.meta.get("contract_path")

    contract_information = payment.meta
    contract_information["signature_datetime"] = (
        timezone.now()
        .astimezone(timezone.get_default_timezone())
        .strftime("%d/%m/%Y à %H:%M")
    )

    contract_full_path = Path(settings.MEDIA_ROOT) / contract_path

    try:
        save_pdf_contract(
            contract_template=payment_type.contract_template_name,
            contract_information=contract_information,
            dest_path=contract_full_path,
            layout_template=payment_type.pdf_layout_template_name,
        )
    except subprocess.TimeoutExpired as exc:
        self.retry(countdown=60, exc=exc)

    payment.meta["contract_path"] = contract_path
    payment.save()

    return contract_path


@shared_task(bind=True)
def send_contract_confirmation_email(self, payment_id):
    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
        return None

    person = payment.person

    if "contract_path" not in payment.meta:
        raise RuntimeError(
            "Contrat non généré pour le paiement {}".format(repr(payment))
        )

    full_name = f'{payment.meta["first_name"]} {payment.meta["last_name"]}'

    try:
        with open(
            Path(settings.MEDIA_ROOT) / payment.meta["contract_path"], mode="rb"
        ) as contract:
            send_mosaico_email(
                code="CONTRACT_CONFIRMATION",
                subject="Votre contrat de prêt",
                from_email=settings.EMAIL_FROM,
                bindings={
                    "CHER_PRETEUR": SUBSTITUTIONS["cher_preteur"][
                        payment.meta["gender"]
                    ]
                },
                recipients=[person],
                attachments=[
                    {
                        "filename": f"contrat_pret_{slugify(full_name, only_ascii=True)}.pdf",
                        "content": contract.read(),
                        "mimetype": "application/pdf",
                    }
                ],
            )
    except (smtplib.SMTPException, socket.error) as exc:
        self.retry(countdown=60, exc=exc)
