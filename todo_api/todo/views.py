from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import TodoItem
from .serializers import TodoItemSerializer


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoItemSerializer
    queryset = TodoItem.objects.all()

    @action(methods=['GET'], detail=False, url_path='completed', url_name='get_completed_todos')
    def get_completed_todos(self, request):
        completed_todos = self.get_queryset().filter(completed=True)
        serializer = self.get_serializer_class()(completed_todos, many=True)

        if len(completed_todos) <= 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_200_OK)
