"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DeliveryMapInnerProps {
  centerLat: number;
  centerLng: number;
  pinLat: number | null;
  pinLng: number | null;
  onPinChange: (lat: number, lng: number) => void;
}

// Custom orange marker icon
const orangeIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path fill="#ff5722" d="M16 0C7.16 0 0 7.16 0 16c0 12 16 32 16 32s16-20 16-32c0-8.84-7.16-16-16-16z"/>
      <circle fill="white" cx="16" cy="16" r="6"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

export default function DeliveryMapInner({
  centerLat,
  centerLng,
  pinLat,
  pinLng,
  onPinChange,
}: DeliveryMapInnerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update pin position
        onPinChange(latitude, longitude);
        
        // Pan map to new location
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapRef.current.setView([latitude, longitude], 16);
        }
        
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable it in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("Unable to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [pinLat || centerLat, pinLng || centerLng],
      zoom: 14,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add draggable marker
    const marker = L.marker([pinLat || centerLat, pinLng || centerLng], {
      icon: orangeIcon,
      draggable: true,
    }).addTo(map);

    // Handle marker drag
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      onPinChange(position.lat, position.lng);
    });

    // Handle map click to move marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onPinChange(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [centerLat, centerLng, onPinChange]); // Don't include pinLat/pinLng to avoid re-init

  // Update marker position when pinLat/pinLng change externally
  useEffect(() => {
    if (markerRef.current && pinLat !== null && pinLng !== null) {
      markerRef.current.setLatLng([pinLat, pinLng]);
    }
  }, [pinLat, pinLng]);

  return (
    <div>
      <div ref={containerRef} className="hai-map-container" />
      <p className="text-sm text-[var(--hai-text-muted)] mt-2 text-center">
        📍 Drag the pin or tap the map to set your delivery location
      </p>
      
      {/* Use My Location Button - below map */}
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={locating}
        className="w-full mt-3 px-4 py-3 rounded-xl bg-[var(--hai-accent-primary-light)] border-2 border-[var(--hai-accent-primary)] text-[var(--hai-accent-primary)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[var(--hai-accent-primary)] hover:text-white transition-colors disabled:opacity-50"
      >
        {locating ? (
          <>
            <span className="animate-spin">⏳</span>
            Detecting...
          </>
        ) : (
          <>
            📍 Detect My Location
          </>
        )}
      </button>
      
      {locationError && (
        <p className="text-[var(--hai-accent-red)] text-sm mt-2 text-center">{locationError}</p>
      )}
    </div>
  );
}
