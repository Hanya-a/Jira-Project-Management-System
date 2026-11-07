from rest_framework import viewsets, status
from rest_framework.response import Response
from ..serializers.Verify2FASerializer import Verify2FASerializer

class Verify2FAView(viewsets.ViewSet):

    def create(self, request):
        serializer = Verify2FASerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )