from django.shortcuts import render
from django.http import JsonResponse
from .models import IoTDevice
import paho.mqtt.publish as publish

def list_devices(request):
    devices = IoTDevice.objects.all().values("id", "name", "is_on")
    return JsonResponse(list(devices), safe=False)

def toggle_device(request, device_id):
    try:
        # Retrieve the device
        device = IoTDevice.objects.get(id=device_id)
        # Toggle the device state
        device.is_on = not device.is_on
        device.save()

        # Send MQTT message
        publish.single(
            topic=f"iot/devices/{device_id}",
            payload=f"{device.name} is now {'on' if device.is_on else 'off'}",
            hostname="test.mosquitto.org"
        )

        return JsonResponse({"id": device.id, "name": device.name, "is_on": device.is_on})
    except IoTDevice.DoesNotExist:
        return JsonResponse({"error": "Device not found"}, status=404)
