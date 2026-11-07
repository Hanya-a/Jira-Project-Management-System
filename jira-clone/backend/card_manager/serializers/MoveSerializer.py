from rest_framework import serializers
from ..models.MoveModel import Move
from ..models.CardModel import CardModel
from ..models.ProjectModel import ProjectModel

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = [
            "id",
            "card",
            "from_project",
            "to_project",
            "moved_by",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "from_project",
            "moved_by",
            "created_at",
        ]


    card = serializers.SlugRelatedField(
        queryset=CardModel.objects.all(),
        slug_field="key"
    )

    from_project = serializers.SlugRelatedField(
        read_only=True,
        slug_field="key"
    )

    to_project = serializers.SlugRelatedField(
        queryset=ProjectModel.objects.all(),
        slug_field="key"
    )

    moved_by = serializers.SlugRelatedField(
        read_only=True,
        slug_field="username"
    )
