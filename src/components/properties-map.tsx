import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatPrice, propertyTypeLabel } from "@/lib/format";
import { pinColor } from "@/lib/map-styles";
import { getClientGoogleMapsApiKey, getClientGoogleMapId } from "@/lib/google-maps";

export type MapProperty = {
  id: string;
  title: string;
  slug: string | null;
  property_type: string;
  listing_type: string;
  price: number;
  currency: string;
  city: string | null;
  hero_image: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function PropertiesMap({ properties }: { properties: MapProperty[] }) {
  const [ready, setReady] = useState(false);
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<MapProperty | null>(null);

  useEffect(() => {
    setApiKey(getClientGoogleMapsApiKey());
    setReady(true);
  }, []);

  const withCoords = properties.filter(
    (p) => p.latitude != null && p.longitude != null,
  ) as (MapProperty & { latitude: number; longitude: number })[];

  if (!ready) {
    return <div className="h-[min(70vh,640px)] animate-pulse rounded-2xl bg-white/5" />;
  }

  if (!apiKey) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#141414] p-8 text-center">
        <p className="font-medium text-white">Google Maps not configured</p>
        <p className="mt-2 max-w-md text-sm text-white/50">
          Add <code className="rounded bg-white/10 px-1">VITE_GOOGLE_MAPS_API_KEY</code> to your{" "}
          <code className="rounded bg-white/10 px-1">.env</code> file, then restart{" "}
          <code className="rounded bg-white/10 px-1">npm run dev</code>.
        </p>
      </div>
    );
  }

  if (withCoords.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/50">
        No published properties with map coordinates yet. Add location in admin when creating listings.
      </div>
    );
  }

  const center = {
    lat: withCoords.reduce((s, p) => s + p.latitude, 0) / withCoords.length,
    lng: withCoords.reduce((s, p) => s + p.longitude, 0) / withCoords.length,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-card">
        <Map
          defaultCenter={center}
          defaultZoom={withCoords.length === 1 ? 14 : 10}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId={getClientGoogleMapId()}
          className="h-[min(55vh,480px)] w-full sm:h-[min(70vh,640px)]"
        >
          {withCoords.map((p) => (
            <AdvancedMarker
              key={p.id}
              position={{ lat: Number(p.latitude), lng: Number(p.longitude) }}
              onClick={() => setSelected(p)}
            >
              <Pin background={pinColor(p.property_type)} borderColor="#0a0a0a" glyphColor="#0a0a0a" />
            </AdvancedMarker>
          ))}
          {selected && selected.latitude != null && selected.longitude != null && (
            <InfoWindow
              position={{ lat: Number(selected.latitude), lng: Number(selected.longitude) }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="max-w-[220px] p-1">
                {selected.hero_image && (
                  <img src={selected.hero_image} alt="" className="mb-2 h-24 w-full rounded object-cover" />
                )}
                <p className="text-xs uppercase text-muted-foreground">{propertyTypeLabel(selected.property_type)}</p>
                <p className="font-semibold text-foreground">{selected.title}</p>
                <p className="text-sm font-medium">
                  {formatPrice(Number(selected.price), selected.currency, selected.listing_type)}
                </p>
                {selected.city && <p className="text-xs text-muted-foreground">{selected.city}</p>}
                <Link
                  to="/properties/$slug"
                  params={{ slug: selected.slug ?? selected.id }}
                  className="mt-2 inline-block text-xs font-medium text-[#3d5c00] underline"
                >
                  View listing →
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50">
        {Object.entries({
          villa: "Villas",
          apartment: "Apartments",
          townhouse: "Townhouses",
          land: "Land",
          commercial: "Commercial",
        }).map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: pinColor(k) }} />
            {label}
          </span>
        ))}
      </div>
    </APIProvider>
  );
}
