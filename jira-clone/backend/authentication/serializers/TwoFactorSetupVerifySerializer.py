import pyotp
from rest_framework import serializers


class TwoFactorSetupVerifySerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6,min_length=6)

    def validate(self, data):
        request = self.context.get("request")

        if request is None:
            raise serializers.ValidationError("Request context is required.")

        if not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError("Authenticated user is required.")

        user = request.user

        if not user.two_factor_secret:
            raise serializers.ValidationError(
                "Two-factor authentication setup has not been started."
            )

        totp = pyotp.TOTP(user.two_factor_secret)

        if not totp.verify(data["code"]):
            raise serializers.ValidationError("Invalid 2FA code.")

        user.two_factor_enabled = True
        user.save(update_fields=["two_factor_enabled"])

        return {
            "message": "Two-factor authentication enabled successfully"
        }