from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..models.ProjectModel import ProjectModel
from ..serializers.ProjectSerializer import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see projects they are members of
        return ProjectModel.objects.filter(
            members=self.request.user
        ).select_related("created_by")

    def perform_create(self, serializer):
        project = serializer.save(
            created_by=self.request.user
        )

        project.key = f"PRO-{project.id}"
        project.save()

        # Creator automatically becomes a member
        project.members.add(self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()