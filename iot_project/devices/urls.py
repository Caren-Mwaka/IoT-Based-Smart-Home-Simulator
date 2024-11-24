from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_devices),
    path("<int:device_id>/toggle/", views.toggle_device),
]
