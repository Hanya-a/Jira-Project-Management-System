from rest_framework import serializers
from ..models.WorkLogModel import WorkLog
from ..models.CardModel import CardModel

class WorkLogSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field="username"
    )

    card = serializers.SlugRelatedField(
        queryset=CardModel.objects.all(),
        slug_field="key"
    )
    class Meta:
        model = WorkLog
        fields = [
            "id",
            "card",
            "user",
            "time_spent",
            "time_remaining",
            "date_started",
            "work_description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

