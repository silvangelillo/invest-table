"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { CATEGORY_CONFIG, cn } from "@/lib/utils";
import { MapFilterBar } from "./MapFilterBar";
import { StartupPopup } from "./StartupPopup";
import type { Startup, StartupCategory } from "@/types";
import { MOCK_STARTUPS } from "@/lib/mock-data";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import("react-leaflet").then((m) => m.TileLayer),    { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip      = dynamic(() => import("react-leaflet").then((m) => m.Tooltip),      { ssr: false });

// Inner component that uses Leaflet hooks — loaded dynamically
const MapClickListener = dynamic(
  () => import("./MapClickListener"),
  { ssr: false }
);

const EU_CENTER: [number, number] = [51.5, 10.5];
const EU_ZOOM = 4;

interface InvestMapProps {
  startups?: Startup[];
  locationPickMode?: boolean;
  onLocationPick?: (lat: number, lng: number) => void;
  pickedLat?: number;
  pickedLng?: number;
  height?: string;
}

export function InvestMap({
  startups = MOCK_STARTUPS,
  locationPickMode = false,
  onLocationPick,
  pickedLat,
  pickedLng,
  height = "600px",
}: InvestMapProps) {
  const [activeCategories, setActiveCategories] = useState<StartupCategory[]>([
    "Tech", "Food", "Service", "Sustainability",
  ]);
  const [selected, setSelected]   = useState<Startup | null>(null);
  const [isClient, setIsClient]   = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
  }, []);

  const visible = useMemo(
    () => locationPickMode ? [] : startups.filter((s) => activeCategories.includes(s.category)),
    [startups, activeCategories, locationPickMode]
  );

  const counts = useMemo(() => {
    const c = { Tech: 0, Food: 0, Service: 0, Sustainability: 0 } as Record<StartupCategory, number>;
    startups.forEach((s) => c[s.category]++);
    return c;
  }, [startups]);

  if (!isClient) {
    return (
      <div className="rounded-3xl bg-gray-100 animate-pulse flex items-center justify-center" style={{ height }}>
        <p className="text-gray-400 text-sm">Loading map…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!locationPickMode && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <MapFilterBar active={activeCategories} onChange={setActiveCategories} counts={counts} />
          <div className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-700">{visible.length}</span> startups
          </div>
        </div>
      )}

      <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-glass-lg" style={{ height }}>
        <MapContainer
          center={EU_CENTER}
          zoom={EU_ZOOM}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
          attributionControl={false}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Map click handler for location pick mode */}
          {locationPickMode && onLocationPick && (
            <MapClickListener onPick={onLocationPick} />
          )}

          {/* Startup markers */}
          {visible.map((startup) => {
            const cfg = CATEGORY_CONFIG[startup.category];
            const isSelected = selected?.id === startup.id;
            return (
              <CircleMarker
                key={startup.id}
                center={[startup.lat, startup.lng]}
                radius={isSelected ? 10 : 7}
                pathOptions={{
                  color: "white", weight: isSelected ? 3 : 2,
                  fillColor: cfg.dot, fillOpacity: 1, opacity: 1,
                }}
                eventHandlers={{ click: () => setSelected(isSelected ? null : startup) }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <div className="text-xs font-semibold text-gray-900 whitespace-nowrap">{startup.name}</div>
                  <div className="text-[10px] text-gray-500">{startup.city}</div>
                </Tooltip>
              </CircleMarker>
            );
          })}

          {/* Picked location marker */}
          {locationPickMode && pickedLat != null && pickedLng != null && (
            <CircleMarker
              center={[pickedLat, pickedLng]}
              radius={10}
              pathOptions={{ color: "#2563eb", weight: 3, fillColor: "#3b82f6", fillOpacity: 0.9, opacity: 1 }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                <span className="text-xs font-semibold text-blue-700">📍 Your location</span>
              </Tooltip>
            </CircleMarker>
          )}
        </MapContainer>

        {/* Location pick banner */}
        {locationPickMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-medium shadow-lg pointer-events-none">
            📍 Click anywhere on the map to set your location
          </div>
        )}

        {/* Popup */}
        {selected && !locationPickMode && (
          <StartupPopup startup={selected} onClose={() => setSelected(null)} />
        )}

        {/* Legend (only in normal mode) */}
        {!locationPickMode && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-glass p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            {(["Tech", "Food", "Service", "Sustainability"] as StartupCategory[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <div key={cat} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: cfg.dot }} />
                  <span className="text-xs text-gray-600">{cat}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
