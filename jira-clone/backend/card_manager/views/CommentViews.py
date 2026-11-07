from rest_framework import viewsets
from ..serializers.CommentSerializer import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from ..models.CommentModel import Comment


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(
            card__project__members=self.request.user
        )

    def perform_create(self, serializer):
        card = serializer.validated_data["card"]

        if not card.project.members.filter(id=self.request.user.id).exists():
            raise PermissionDenied(
                "You must be a project member to comment."
            )

        serializer.save(author=self.request.user)