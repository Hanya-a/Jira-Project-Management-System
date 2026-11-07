from django.conf import settings
from django.db import models


class ProjectModel(models.Model):
    STATUS = [
        ("archive", "Archive"),
        ("done", "Done"),
        ("active", "Active"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    key = models.CharField(max_length=10, unique=True)

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="projects"
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_projects"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="active"
    )

    def __str__(self):
        return f"{self.key} - {self.name}"