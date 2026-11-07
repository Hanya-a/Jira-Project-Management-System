from django.db import models
from .LabelModel import Label
from .ProjectModel import ProjectModel
from django.conf import settings


class CardModel(models.Model):

    PRIORITY=[
        ("medium", "Medium"),
        ("highest","Highest"),
        ("high", "High"),
        ("low", "Low"),
        ("lowest", "Lowest"),

    ]
    STATUS=[
        ("done","DONE"),
        ("todo","TODO"),
        ("in_review","IN REVIEW"),
        ("in_progress","IN PROGRESS")
    ]
    name= models.CharField(max_length=100)
    key = models.CharField(max_length=10, unique=True)
    summary = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="todo")
    assignee= models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True,blank=True,related_name="assigned_cards"
    )
    reporter= models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True,blank=True,related_name="reported_cards"
    )
    priority = models.CharField(
        max_length=20, choices=PRIORITY, default="medium"
    )
    due_date = models.DateField()
    labels=models.ManyToManyField(Label)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    project = models.ForeignKey(
        ProjectModel,on_delete=models.CASCADE,related_name="cards"
    )

    def __str__(self):
        return f"{self.key} - {self.name}"
