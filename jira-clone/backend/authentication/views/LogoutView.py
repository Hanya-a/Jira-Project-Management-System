from rest_framework import viewsets,status
from rest_framework.response import Response

from ..serializers.LogoutSerializer import LogoutSerializer

class LogoutView(viewsets.ViewSet):
    def create(self,request):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
