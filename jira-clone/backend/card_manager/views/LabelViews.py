from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from ..models.LabelModel import Label
from ..serializers.LabelSerializer import LabelSerializer


class LabelViewSet(viewsets.ModelViewSet):
    serializer_class = LabelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Label.objects.filter(
            project__members=self.request.user
        )

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        user = self.request.user

        if not project.members.filter(id=user.id).exists():
            raise PermissionDenied(
                "Only project members can create labels."
            )

        serializer.save()