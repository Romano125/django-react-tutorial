from django.db import models
from django.utils import timezone


class TodoItem(models.Model):
    label = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.label} created at {self.created_at}.'
