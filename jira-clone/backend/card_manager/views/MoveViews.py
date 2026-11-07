from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from ..models.MoveModel import Move
from ..serializers.MoveSerializer import MoveSerializer


class MoveViewSet(viewsets.ModelViewSet):
    serializer_class = MoveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Move.objects.filter(
            card__project__members=self.request.user
        )

    def perform_create(self, serializer):
        card = serializer.validated_data["card"]
        destination_project = serializer.validated_data["to_project"]
        user = self.request.user

        if user != card.assignee:
            raise PermissionDenied(
                "Only the card assignee can move the card."
            )

        old_project = card.project
        card.project = destination_project
        card.save(update_fields=["project"])

        serializer.save(
            from_project=old_project,
            moved_by=user
        )