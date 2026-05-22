export const MAP_PIN_COLORS: Record<string, string> = {
  villa: "#c6f135",
  apartment: "#60a5fa",
  townhouse: "#f472b6",
  land: "#fbbf24",
  commercial: "#a78bfa",
};

export function pinColor(propertyType: string) {
  return MAP_PIN_COLORS[propertyType] ?? "#ffffff";
}
