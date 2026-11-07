from rest_framework import serializers
from ..models.CardModel import CardModel
from ..models.LabelModel import Label
from django.contrib.auth import get_user_model

User = get_user_model()

class CardSerializer(serializers.ModelSerializer):


    assignee = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field="username",
        allow_null=True,
        required=False
    )

    labels = serializers.SlugRelatedField(
        many=True,
        queryset=Label.objects.all(),
        slug_field="name",
        required=False
    )

    class Meta:
        model = CardModel
        fields = [
            "id","name","key",
            "summary","status","assignee",
            "reporter","priority","due_date","labels",
            "created_at",
            "updated_at",
            "project",
        ]

        read_only_fields = [
            "id",
            "key",
            "reporter",
            "created_at",
            "updated_at",
        ]
