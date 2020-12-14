from django.http import HttpResponseRedirect
from django.views.generic import DetailView
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView, GenericAPIView
from rest_framework.response import Response

from agir.activity.models import Activity, Announcement
from agir.activity.serializers import ActivitySerializer, ActivityStatusUpdateRequest
from agir.lib.rest_framework_permissions import (
    GlobalOrObjectPermissions,
    IsPersonPermission,
)


class ActivityAPIView(RetrieveUpdateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = (GlobalOrObjectPermissions,)


class AnnouncementLinkView(DetailView):
    model = Announcement
    queryset = Announcement.objects.all()

    def get(self, request, *args, **kwargs):
        announcement = self.get_object()
        user = request.user
        if hasattr(user, "person"):
            Activity.objects.update_or_create(
                recipient=user.person,
                announcement=announcement,
                defaults={
                    "type": Activity.TYPE_ANNOUNCEMENT,
                    "status": Activity.STATUS_INTERACTED,
                },
            )
        return HttpResponseRedirect(announcement.link)


class ActivityStatusUpdateView(GenericAPIView):
    serializer_class = ActivityStatusUpdateRequest
    permission_classes = (IsPersonPermission,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        Activity.objects.filter(
            recipient=request.user.person,  # pour ne laisser la possibilité de modifier que ses propres activités
            id__in=serializer.validated_data["ids"],
        ).update(status=serializer.validated_data["status"])

        return Response(None, status=status.HTTP_204_NO_CONTENT)
