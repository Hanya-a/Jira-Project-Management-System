from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..models.HistoryModel import HistoryModel
from ..serializers.HistorySerializer import HistorySerializer


class HistoryViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HistoryModel.objects.filter(
            card__project__members=self.request.user
        ).select_related(
            "card",
            "user",
            "card__project"
        )