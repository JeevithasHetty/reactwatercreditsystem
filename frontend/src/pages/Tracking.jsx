import { useEffect, useState } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// FIX leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""));

export default function Tracking() {
  const [position, setPosition] = useState([12.9716, 77.5946]); // default Bangalore

  useEffect(() => {
    socket.on("locationUpdate", (data) => {
      setPosition([data.lat, data.lng]);
    });

    return () => socket.off("locationUpdate");
  }, []);

  return (
    <div style={{ height: "80vh", margin: "20px" }}>
      <h2>Live Water Transport Tracking</h2>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Transporter Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
