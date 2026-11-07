from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=30)

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"]
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid password or username"
            )

        if user.two_factor_enabled:
            return {
                "username": user.username,
                "requires_2fa": True
            }

        refresh = RefreshToken.for_user(user)

        return {
            "username": user.username,
            "requires_2fa": False,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }