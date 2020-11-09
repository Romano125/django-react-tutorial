from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # register base path
    path('', include('todo_api.todo.urls')),
]
