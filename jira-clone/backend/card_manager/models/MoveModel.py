from django.db import models
from .CardModel import CardModel
from django.conf import settings
from .ProjectModel import ProjectModel


class Move(models.Model):
    card = models.ForeignKey(
        CardModel,on_delete=models.CASCADE,related_name="moves")
    from_project = models.ForeignKey(
        ProjectModel,on_delete=models.CASCADE,related_name="outgoing_moves")
    to_project = models.ForeignKey(
        ProjectModel,on_delete=models.CASCADE,related_name="incoming_moves")
    moved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.card} - {self.from_project} → {self.to_project}"