from django.db import models
from django.conf import settings
from .CardModel import CardModel


class WorkLog(models.Model):
    card = models.ForeignKey(CardModel,on_delete=models.CASCADE,related_name="work_logs")
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True)
    time_spent = models.DurationField()
    time_remaining = models.DurationField(null=True,blank=True)
    date_started = models.DateTimeField()
    work_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.card} - {self.user}"