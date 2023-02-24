from django.urls import path

from . import views

urlpatterns = [
    path(
        "evenements/<uuid:pk>/og-image/<str:cache_key>/",
        views.EventOGImageView.as_view(),
        name="view_og_image_event",
    ),
    path("evenements/liste/", views.EventSearchView.as_view(), name="search_event"),
    path(
        "evenements/<uuid:pk>/participer/",
        views.EventParticipationView.as_view(),
        name="view_event_participation",
    ),
    path(
        "evenements/<uuid:pk>/icalendar/",
        views.EventIcsView.as_view(),
        name="legacy_ics_event",
    ),
    path(
        "evenements/<uuid:pk>/icalendar.ics",
        views.EventIcsView.as_view(),
        name="ics_event",
    ),
    path(
        "evenements/<uuid:pk>/manage/",
        views.ManageEventView.as_view(),
        name="manage_event",
    ),
    path(
        "evenements/<uuid:pk>/modifier/",
        views.ModifyEventView.as_view(),
        name="edit_event",
    ),
    path(
        "evenements/<uuid:pk>/quitter/",
        views.QuitEventView.as_view(),
        name="quit_event",
    ),
    path(
        "evenements/<uuid:pk>/inscription/",
        views.RSVPEventView.as_view(),
        name="rsvp_event",
    ),
    path(
        "evenements/<uuid:pk>/inscription-externe/",
        views.ExternalRSVPView.as_view(),
        name="external_rsvp_event",
    ),
    path(
        "evenements/rsvp/<pk>/changer-paiement/",
        views.ChangeRSVPPaymentView.as_view(),
        name="rsvp_change_payment",
    ),
    path("evenements/paiement/", views.PayEventView.as_view(), name="pay_event"),
    path(
        "evenements/<uuid:pk>/localisation/",
        views.ChangeEventLocationView.as_view(),
        name="change_event_location",
    ),
    path(
        "evenements/<uuid:pk>/compte-rendu/",
        views.EditEventReportView.as_view(),
        name="edit_event_report",
    ),
    path(
        "evenements/<uuid:pk>/importer-image/",
        views.UploadEventImageView.as_view(),
        name="upload_event_image",
    ),
    path(
        "evenements/<uuid:pk>/envoyer-compte-rendu/",
        views.SendEventReportView.as_view(),
        name="send_event_report",
    ),
    path(
        "evenements/coorganization/<int:pk>/accepter/",
        views.AcceptEventCoorganizationInvitationView.as_view(),
        name="accept_event_group_coorganization",
    ),
    path(
        "evenements/coorganization/<int:pk>/refuser/",
        views.RefuseEventCoorganizationInvitationView.as_view(),
        name="refuse_event_group_coorganization",
    ),
    path("agenda/<slug:slug>/", views.CalendarView.as_view(), name="view_calendar"),
    path(
        "agenda/<slug:slug>/icalendar/",
        views.CalendarIcsView.as_view(),
        name="legacy_ics_calendar",
    ),
    path(
        "agenda/<slug:slug>/icalendar.ics",
        views.CalendarIcsView.as_view(),
        name="ics_calendar",
    ),
    path("conference", views.jitsi_reservation_view, name="jitsi_reservation"),
    path(
        "conference/<int:pk>", views.jitsi_delete_conference_view, name="jitsi_delete"
    ),
    path(
        "api/evenements/options/",
        views.EventCreateOptionsAPIView.as_view(),
        name="api_event_create_options",
    ),
    path(
        "api/evenements/creer/",
        views.CreateEventAPIView.as_view(),
        name="api_create_event",
    ),
    path(
        "api/evenements/<uuid:pk>/modifier/",
        views.UpdateEventAPIView.as_view(),
        name="api_update_event",
    ),
    path(
        "api/evenements/rsvped/",
        views.EventRsvpedAPIView.as_view(),
        name="api_event_rsvped",
    ),
    path(
        "api/evenements/rsvped/passes/",
        views.PastRsvpedEventAPIView.as_view(),
        name="api_past_rsvped_events",
    ),
    path(
        "api/evenements/rsvped/en-cours/",
        views.OngoingRsvpedEventsAPIView.as_view(),
        name="api_ongoing_rsvped_events",
    ),
    path(
        "api/evenements/suggestions/",
        views.EventSuggestionsAPIView.as_view(),
        name="api_event_suggestions",
    ),
    path(
        "api/evenements/mes-groupes/",
        views.UserGroupEventAPIView.as_view(),
        name="api_user_group_events",
    ),
    path(
        "api/evenements/organises/",
        views.OrganizedEventAPIView.as_view(),
        name="api_organized_events",
    ),
    path(
        "api/evenements/grands-evenements/",
        views.GrandEventAPIView.as_view(),
        name="api_grand_events",
    ),
    path(
        "api/evenements/projets/",
        views.EventProjectsAPIView.as_view(),
        name="api_event_projects",
    ),
    path(
        "api/evenements/<uuid:pk>/messages/",
        views.EventMessagesAPIView.as_view(),
        name="api_event_messages",
    ),
    path(
        "api/evenements/<uuid:pk>/",
        views.EventAPIView.as_view(),
        name="api_event",
    ),
    path(
        "api/evenements/<uuid:pk>/details/",
        views.EventDetailAPIView.as_view(),
        name="api_event_details",
    ),
    path(
        "api/evenements/<uuid:pk>/inscription/",
        views.RSVPEventAPIView.as_view(),
        name="api_rsvp_event",
    ),
    path(
        "api/evenements/<uuid:pk>/inscription/<uuid:groupPk>/",
        views.RSVPEventAPIView.as_view(),
        name="api_quit_rsvp_event_as_group",
    ),
    path(
        "api/evenements/<uuid:pk>/inscription-groupe/",
        views.RSVPEventAsGroupAPIView.as_view(),
        name="api_rsvp_event_as_group",
    ),
    path(
        "api/evenements/<uuid:event_id>/projet/",
        views.EventProjectAPIView.as_view(),
        name="api_event_project",
    ),
    path(
        "api/evenements/<uuid:event_id>/projet/document/",
        views.CreateEventProjectDocumentAPIView.as_view(),
        name="api_create_event_project_document",
    ),
    path(
        "api/evenements/<uuid:pk>/details-avances/",
        views.EventDetailAdvancedAPIView.as_view(),
        name="api_event_advanced_details",
    ),
    path(
        "api/evenements/<uuid:pk>/organisateurs/",
        views.CreateOrganizerConfigAPIView.as_view(),
        name="api_event_organizers",
    ),
    path(
        "api/evenements/<uuid:pk>/groupes-organisateurs/",
        views.EventGroupsOrganizersAPIView.as_view(),
        name="api_event_group_organizers",
    ),
    path(
        "api/evenements/<uuid:pk>/annuler/",
        views.CancelEventAPIView.as_view(),
        name="cancel_event",
    ),
    path(
        "api/evenements/<uuid:pk>/bilan/",
        views.EventReportPersonFormAPIView.as_view(),
        name="api_event_report_personform",
    ),
    path(
        "api/evenements/<uuid:pk>/visuels/",
        views.EventAssetListAPIView.as_view(),
        name="api_event_assets",
    ),
]
