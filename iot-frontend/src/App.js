import React, { useState, useEffect } from "react";
import { Client } from "paho-mqtt";

const App = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        // Fetch devices from backend
        fetch("http://localhost:8000/devices/")
          .then((res) => res.json())
          .then(setDevices)
          .catch((error) => console.error("Error fetching devices:", error));


        // MQTT Client Setup
        const client = new Client("ws://test.mosquitto.org:8080/mqtt", "clientId");
        client.onMessageArrived = (message) => {
            console.log("Message received:", message.payloadString);
        };
        client.connect({ onSuccess: () => console.log("MQTT Connected") });
    }, []);

    const toggleDevice = (id) => {
      const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1];  // Get CSRF token from cookies
      
      fetch(`http://localhost:8000/devices/${id}/toggle/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,  // Include CSRF token here
          },
      })
          .then((res) => res.json())
          .then((updatedDevice) => {
              setDevices((prev) =>
                  prev.map((device) =>
                      device.id === updatedDevice.id ? updatedDevice : device
                  )
              );
          })
          .catch((error) => console.error("Error toggling device:", error));
  };
  

    return (
      <div>
      <h1>IoT Devices</h1>
      <pre>{JSON.stringify(devices, null, 2)}</pre>  {/* Add this line to view the devices data */}
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            {device.name} - {device.is_on ? "On" : "Off"}
            <button onClick={() => toggleDevice(device.id)}>Toggle</button>
          </li>
        ))}
      </ul>
    </div>
    
    );
};

export default App;
