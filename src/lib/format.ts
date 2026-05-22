export function formatPrice(price: number, currency = "USD", listingType = "sale") {
  const n = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
  if (listingType === "rent") return `${n}/mo`;
  if (listingType === "short_let") return `${n}/night`;
  return n;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function propertyTypeLabel(t: string) {
  return ({
    apartment: "Apartment",
    villa: "Villa",
    land: "Land",
    commercial: "Commercial",
    townhouse: "Townhouse",
  } as Record<string, string>)[t] ?? t;
}

export function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function listingTypeShort(t: string) {
  if (t === "sale") return "Sale";
  if (t === "rent") return "Rent";
  if (t === "short_let") return "Short let";
  return t;
}

/** Compact area for cards (e.g. 121212 → 121k m²) */
export function formatArea(sqm: number | null | undefined) {
  if (sqm == null || Number.isNaN(Number(sqm))) return null;
  const n = Number(sqm);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M m²`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k m²`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k m²`;
  return `${n.toLocaleString()} m²`;
}

export function propertyLocationLine(p: {
  address?: string | null;
  city?: string | null;
  country?: string | null;
}) {
  const cityCountry = [p.city, p.country].filter(Boolean).join(", ");
  if (p.address && cityCountry) return `${p.address} · ${cityCountry}`;
  if (p.address) return p.address;
  return cityCountry || null;
}