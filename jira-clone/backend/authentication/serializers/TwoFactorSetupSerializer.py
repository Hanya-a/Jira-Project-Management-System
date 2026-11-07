import pyotp
from rest_framework import serializers


class TwoFactorSetupSerializer(serializers.Serializer):

    def validate(self, attrs):
        request = self.context.get("request")

        if request is None:
            raise serializers.ValidationError(
                "Request context is required."
            )

        if not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Authenticated user is required."
            )

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        # Generate the secret key that connects the user's account
        # to their authenticator app.
        secret = pyotp.random_base32()

        user.two_factor_secret = secret
        user.save(update_fields=["two_factor_secret"])

        totp = pyotp.TOTP(secret)

        provisioning_uri = totp.provisioning_uri(
            name=user.email,
            issuer_name="Project Management System"
        )

        return {
            "provisioning_uri": provisioning_uri
        }