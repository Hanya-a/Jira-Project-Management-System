from rest_framework import serializers
from ..models.CommentModel import Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):


    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field="username"
    )

    class Meta:
        model=Comment
        fields=["card","author","content","created_at","updated_at"]
        read_only_fields=["author","created_at","updated_at"]