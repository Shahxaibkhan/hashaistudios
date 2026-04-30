"use client";

import dynamic from "next/dynamic";

interface DeliveryMapProps {
  centerLat: number;
  centerLng: number;
  pinLat: number | null;
  pinLng: number | null;
  onPinChange: (lat: number, lng: number) => void;
}

// Dynamically import the actual map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./DeliveryMapInner"), {
  ssr: false,
  loading: () => (
    <div className="hai-map-container flex items-center justify-center bg-[var(--hai-bg-card)]">
      <div className="hai-skeleton w-full h-full" />
    </div>
  ),
});

export default function DeliveryMap(props: DeliveryMapProps) {
  return <MapComponent {...props} />;
}
