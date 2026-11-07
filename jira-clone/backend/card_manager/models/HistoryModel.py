from django.db import models
from .CardModel import CardModel
from django.conf import settings


class HistoryModel(models.Model):
    card=models.ForeignKey(CardModel,on_delete=models.SET_NULL,null=True)
    user=models.ForeignKey( settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    action=models.CharField(max_length=100)
    description=models.TextField()
    created_at= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.card} - {self.action}"
    