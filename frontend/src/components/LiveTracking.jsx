import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useSocket } from "../context/SocketContext";
import "leaflet/dist/leaflet.css";

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

    // Custom captain icon
    const captainIcon = L.divIcon({
      html: `<div style="background-color: #000; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-center: center; border: 3px solid yellow; font-weight: bold;">C</div>`,
      iconSize: [40, 40],
      className: "captain-marker",
    });

    // Remove old marker and add new one
    if (captainMarkerRef.current) {
      mapInstanceRef.current.removeLayer(captainMarkerRef.current);
    }

    captainMarkerRef.current = L.marker([ltd, lng], { icon: captainIcon })
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
