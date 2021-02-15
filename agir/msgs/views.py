from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from agir.msgs.serializers import UserReportSerializer


class UserReportAPIView(CreateAPIView):
    serializer_class = UserReportSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user.person)
