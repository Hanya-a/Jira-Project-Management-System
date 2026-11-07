from django.db import models
from .ProjectModel import ProjectModel


class Label(models.Model):
    name = models.CharField(max_length=50)
    project = models.ForeignKey(
        ProjectModel,
        on_delete=models.CASCADE,
        related_name="labels"
    )

    def __str__(self):
        return self.name