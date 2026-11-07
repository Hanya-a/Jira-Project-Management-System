from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, data):
        try:
            self.refresh_token = RefreshToken(data["refresh"])
        except TokenError:
            raise serializers.ValidationError(
                "Invalid refresh token"
            )

        return data

    def save(self, **kwargs):
        self.refresh_token.blacklist()