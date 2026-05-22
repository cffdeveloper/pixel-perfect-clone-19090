function cleanEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  if (!trimmed || trimmed === "your_google_maps_api_key") return undefined;
  return trimmed;
}

/** Client-side Maps JS key (Vite inlines import.meta.env at build time) */
export function getClientGoogleMapsApiKey(): string | undefined {
  return cleanEnvValue(import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined);
}

export function getClientGoogleMapId(): string {
  return cleanEnvValue(import.meta.env.VITE_GOOGLE_MAP_ID as string | undefined) || "DEMO_MAP_ID";
}

/** Server geocoding + SSR fallback */
export function getGoogleMapsApiKey(): string | undefined {
  return (
    cleanEnvValue(process.env.GOOGLE_MAPS_API_KEY) ||
    cleanEnvValue(process.env.VITE_GOOGLE_MAPS_API_KEY) ||
    getClientGoogleMapsApiKey()
  );
}

export function googleMapsConfigError(): string {
  return "Add VITE_GOOGLE_MAPS_API_KEY to your .env file (Google Cloud → enable Geocoding API), then restart npm run dev.";
}
