from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(
        max_length=32,
        blank=True,
        null=True
    )