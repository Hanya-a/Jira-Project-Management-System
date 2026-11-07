from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers.TwoFactorSetupSerializer import TwoFactorSetupSerializer


class TwoFactorSetupView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = TwoFactorSetupSerializer(
            data={},
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        return Response(result)