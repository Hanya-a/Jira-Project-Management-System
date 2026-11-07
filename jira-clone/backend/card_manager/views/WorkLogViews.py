from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from ..models.WorkLogModel import WorkLog
from ..serializers.WorkLogSerializer import WorkLogSerializer


class WorkLogViewSet(viewsets.ModelViewSet):
    serializer_class = WorkLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkLog.objects.filter(
            card__project__members=self.request.user
        )

    def perform_create(self, serializer):
        card = serializer.validated_data["card"]

        if not card.project.members.filter(id=self.request.user.id).exists():
            raise PermissionDenied(
                "You must be a project member to add a work log."
            )

        serializer.save(user=self.request.user)