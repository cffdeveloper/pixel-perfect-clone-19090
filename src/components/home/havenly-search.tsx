import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, ChevronDown } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/constants";

const PRICE_OPTIONS = [
  { label: "Any price", value: "" },
  { label: "$5,000", value: "5000" },
  { label: "$10,000", value: "10000" },
  { label: "$25,000", value: "25000" },
  { label: "$50,000", value: "50000" },
  { label: "$100,000", value: "100000" },
  { label: "$500,000", value: "500000" },
  { label: "$1,000,000", value: "1000000" },
];

export function HavenlySearch({ listingType }: { listingType?: "sale" | "rent" }) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [maxPrice, setMaxPrice] = useState("5000");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: "/properties",
      search: {
        city: location || undefined,
        propertyType: propertyType === "any" ? undefined : propertyType,
        listingType: listingType || undefined,
        maxPrice: maxPrice || undefined,
      },
    });
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full flex-col gap-0 overflow-hidden rounded-2xl bg-[#141414] shadow-2xl sm:flex-row sm:items-stretch sm:rounded-full sm:pr-2"
    >
      <div className="flex flex-1 flex-col divide-y divide-white/10 sm:flex-row sm:divide-x sm:divide-y-0">
        <label className="group flex flex-1 cursor-text flex-col px-4 py-3 sm:px-6 sm:py-3">
          <span className="text-[11px] font-medium text-white/50 sm:text-xs">Location</span>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </label>

        <label className="relative flex flex-1 flex-col px-4 py-3 sm:px-6 sm:py-3">
          <span className="text-[11px] font-medium text-white/50 sm:text-xs">Property type</span>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full appearance-none bg-transparent text-white focus:outline-none"
            >
              <option value="apartment" className="bg-[#141414]">Penthouse</option>
              {PROPERTY_TYPES.filter((t) => t.value !== "any" && t.value !== "apartment").map((t) => (
                <option key={t.value} value={t.value} className="bg-[#141414]">
                  {t.label.replace(/s$/, "")}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
          </div>
        </label>

        <label className="relative flex flex-1 flex-col px-4 py-3 sm:px-6 sm:py-3">
          <span className="text-[11px] font-medium text-white/50 sm:text-xs">Max price</span>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full appearance-none bg-transparent text-white focus:outline-none"
            >
              {PRICE_OPTIONS.map((p) => (
                <option key={p.value} value={p.value} className="bg-[#141414]">
                  {p.label === "Any price" ? "No max" : p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
          </div>
        </label>
      </div>

      <button
        type="submit"
        aria-label="Search"
        className="mx-3 mb-3 flex h-12 w-[calc(100%-1.5rem)] items-center justify-center rounded-full bg-[#c6f135] text-[#0a0a0a] transition hover:bg-[#d4ff4a] sm:m-1.5 sm:h-11 sm:w-11 sm:shrink-0"
      >
        <Search className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </form>
  );
}
