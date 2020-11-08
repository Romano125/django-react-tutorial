from rest_framework import serializers
from todo.models import TodoItem


class TodoItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = ('id',
                  'label',
                  'description',
                  'created_at')
