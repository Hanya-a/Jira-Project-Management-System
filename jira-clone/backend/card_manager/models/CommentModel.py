from django.db import models
from django.conf import settings
from .CardModel import CardModel

class Comment(models.Model):
    card = models.ForeignKey(CardModel, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey( settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author} - {self.card}"