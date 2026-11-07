from rest_framework import serializers
from ..models.ProjectModel import ProjectModel
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectModel
        fields = [
            "id",
            "name",
            "description",
            "key",
            "members",
            "created_at",
            "updated_at",
            "status",
            "created_by",
        ]
        read_only_fields = [
            "id",
            "key",
            "created_by",
            "created_at",
            "updated_at",
        ]

    members = serializers.SlugRelatedField(
        many=True,
        queryset=User.objects.all(),
        slug_field="username"
    )

    created_by = serializers.SlugRelatedField(
        read_only=True,
        slug_field="username"
    )