from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers.TwoFactorSetupVerifySerializer import TwoFactorSetupVerifySerializer


class TwoFactorSetupVerifyView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = TwoFactorSetupVerifySerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            return Response(serializer.validated_data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )