from django.urls import path

from . import views

app_name = "cagnottes"

urlpatterns = [
    path(
        "informations/",
        views.PersonalInformationView.as_view(),
        name="personal_information",
    ),
]