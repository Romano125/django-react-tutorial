from rest_framework import routers
from django.urls import path, include

from .views import TodoViewSet

router = routers.DefaultRouter()

# generic crud (get, post, create, delete) + custom operations
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('', include(router.urls))
]
