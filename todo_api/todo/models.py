from django.db import models
from django.utils import timezone


class TodoItem(models.Model):
    label = models.CharField(max_length=20)
    description = models.CharField(max_length=20)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{label} created at {created_at}.'
