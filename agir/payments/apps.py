from django.apps import AppConfig


class PaymentsConfig(AppConfig):
    name = "agir.payments"
    verbose_name = "pagos"

    def ready(self):
        # noinspection PyUnresolvedReferences
        from . import signals
        from .payment_modes import setup_urls

        setup_urls()
