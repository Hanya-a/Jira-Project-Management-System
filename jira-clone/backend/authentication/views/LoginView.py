from rest_framework import viewsets,status
from rest_framework.response import Response

from ..serializers.LoginSerializer import LoginSerializer

class LoginView(viewsets.ViewSet):
    def create(self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
