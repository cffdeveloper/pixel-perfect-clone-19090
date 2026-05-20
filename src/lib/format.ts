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