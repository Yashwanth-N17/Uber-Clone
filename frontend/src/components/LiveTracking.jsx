import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useSocket } from "../context/SocketContext";
import "leaflet/dist/leaflet.css";

const googleLocationIconSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32">
     <path d="M12 0C7 0 3 4 3 9c0 6.627 8.656 16.41 8.936 16.71a1 1 0 0 0 1.528 0C12.344 25.41 21 15.627 21 9c0-5-4-9-9-9zm0 13.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" fill="#1976D2"/>
   </svg>`
);

const googleLocationIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${googleLocationIconSvg}`,
  iconRetinaUrl: `data:image/svg+xml;utf8,${googleLocationIconSvg}`,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -40],
  shadowUrl: markerShadow,
  shadowSize: [44, 44],
  shadowAnchor: [16, 44],
});

const LiveTracking = ({ rideId, captainLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const captainMarkerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(captainLocation);
  const { socket } = useSocket();

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current).setView([28.7041, 77.1025], 15); // Default to Delhi

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Listen for captain location updates
  useEffect(() => {
    socket.on("captain-location-updated", (data) => {
      console.log("Captain location updated:", data);
      updateCaptainLocation(data.location);
    });

    return () => {
      socket.off("captain-location-updated");
    };
  }, [socket]);

  const updateCaptainLocation = (location) => {
    if (!mapInstanceRef.current) return;

    const { ltd, lng } = location;
    setCurrentLocation({ ltd, lng });

    // Remove old marker and add new one
    if (captainMarkerRef.current) {
      mapInstanceRef.current.removeLayer(captainMarkerRef.current);
    }

    captainMarkerRef.current = L.marker([ltd, lng], {
      icon: googleLocationIcon,
    })
      .addTo(mapInstanceRef.current)
      .bindPopup("Captain Location");

    // Center map on captain
    mapInstanceRef.current.setView([ltd, lng], 15);
  };

  useEffect(() => {
    // If captainLocation prop is provided, update on mount
    if (captainLocation && captainLocation.ltd && captainLocation.lng) {
      updateCaptainLocation(captainLocation);
    }
  }, [captainLocation]);

  return (
    <div className="w-full h-full">
      <div
        ref={mapRef}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default LiveTracking;
