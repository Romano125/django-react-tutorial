from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import TodoItem
from .serializers import TodoItemSerializer


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoItemSerializer
    queryset = TodoItem.objects.all()

    @action(methods=['GET'], detail=False)
    def another_endpoint(self, request):
        newest = self.get_queryset().order_by('created_at').last()
        serializer = self.get_serializer_class()(newest)
        return Response(serializer.data)
