import pyotp
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()


class Verify2FASerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    code = serializers.CharField(max_length=6, min_length=6)

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
        except Exception as _:
            raise serializers.ValidationError("Invalid Username")

        if not user.two_factor_enabled:
            raise serializers.ValidationError(
                "Two-factor authentication is not enabled"
            )

        if not user.two_factor_secret:
            raise serializers.ValidationError(
                "Two-factor authentication secret is missing"
            )

        totp = pyotp.TOTP(user.two_factor_secret)

        if not totp.verify(data["code"]):
            raise serializers.ValidationError("Invalid 2FA code")

        refresh = RefreshToken.for_user(user)

        return {
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }