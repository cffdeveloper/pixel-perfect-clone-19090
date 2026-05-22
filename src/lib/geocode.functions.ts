import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminAuth } from "@/integrations/supabase/admin-middleware";
import { getGoogleMapsApiKey, googleMapsConfigError } from "@/lib/google-maps";

export const geocodeAddress = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) => z.object({ address: z.string().min(3).max(500) }).parse(input))
  .handler(async ({ data }) => {
    const key = getGoogleMapsApiKey();
    if (!key) throw new Error(googleMapsConfigError());

    const q = encodeURIComponent(data.address);
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${key}`,
    );
    const json = await res.json();
    if (json.status !== "OK" || !json.results?.[0]) {
      throw new Error("Could not find coordinates for this address");
    }
    const { lat, lng } = json.results[0].geometry.location;
    return { latitude: lat as number, longitude: lng as number, formatted: json.results[0].formatted_address as string };
  });
