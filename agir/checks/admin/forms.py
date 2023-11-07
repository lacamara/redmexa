from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django import forms
from django.utils.translation import gettext_lazy as _, gettext

from agir.checks import DonationCheckPaymentMode
from agir.checks.models import CheckPayment
from agir.donations.apps import DonsConfig
from agir.donations.form_fields import MoneyField
from agir.payments.types import get_payment_choices


class CheckPaymentSearchForm(forms.Form):
    numbers = forms.CharField(
        label="Numéro(s) de chèque",
        required=True,
        help_text=_(
            "Saisissez les numéros de transaction du chèque, séparés par des espaces"
        ),
    )
    amount = MoneyField(label=_("Montant du chèque"), min_value=0, required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.add_input(Submit("submit", "Rechercher"))

    def clean_numbers(self):
        numbers = self.cleaned_data["numbers"].split()

        try:
            numbers = [int(n) for n in numbers]
        except ValueError:
            raise forms.ValidationError(
                _("Entrez les numéros de chèque séparés par des espace")
            )

        missing_checks = []
        for n in numbers:
            try:
                CheckPayment.objects.get(pk=n)
            except CheckPayment.DoesNotExist:
                missing_checks.append(n)

        if len(missing_checks) == 1:
            raise forms.ValidationError(
                gettext("Le chèque n°{n} n'existe pas.").format(n=missing_checks[0])
            )
        elif missing_checks:
            raise forms.ValidationError(
                gettext("Les paiements de numéros {numeros} n'existent pas.").format(
                    numeros=", ".join([str(i) for i in missing_checks])
                )
            )

        return numbers


class CheckPaymentForm(forms.ModelForm):
    status = forms.ChoiceField(
        label=_("Statut"),
        initial=CheckPayment.STATUS_COMPLETED,
        choices=CheckPayment.STATUS_CHOICES,
        required=True,
        disabled=True,
    )
    mode = forms.CharField(
        label=_("Mode de paiement"),
        initial=DonationCheckPaymentMode.id,
        required=True,
        disabled=True,
    )
    type = forms.ChoiceField(
        label=_("Type de paiement"),
        initial=DonsConfig.SINGLE_TIME_DONATION_TYPE,
        choices=get_payment_choices(),
        required=True,
        disabled=True,
    )
