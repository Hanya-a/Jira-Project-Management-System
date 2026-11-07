from rest_framework import serializers
from ..models.HistoryModel import HistoryModel


class HistorySerializer(serializers.ModelSerializer):

    card = serializers.SlugRelatedField(
        read_only=True,
        slug_field="key"
    )

    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field="username"
    )

    class Meta:
        model = HistoryModel
        fields = [
            "id",
            "card",
            "user",
            "action",
            "description",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "card",
            "user",
            "action",
            "description",
            "created_at",
        ]