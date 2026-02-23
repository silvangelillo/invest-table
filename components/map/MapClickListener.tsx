"use client";
import { useMapEvents } from "react-leaflet";

interface MapClickListenerProps {
  onPick: (lat: number, lng: number) => void;
}

export default function MapClickListener({ onPick }: MapClickListenerProps) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
