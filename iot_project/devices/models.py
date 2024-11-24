from django.db import models

class IoTDevice(models.Model):
    name = models.CharField(max_length=100)
    is_on = models.BooleanField(default=False)
