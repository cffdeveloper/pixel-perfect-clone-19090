import { Link } from "@tanstack/react-router";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { formatPrice, propertyTypeLabel } from "@/lib/format";

type Property = {
  id: string;
  slug: string | null;
  title: string;
  property_type: string;
  listing_type: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  city: string | null;
  country: string | null;
  hero_image: string | null;
  images: string[] | null;
};

export function PropertyCard({ p }: { p: Property; variant?: "light" | "dark" }) {
  const img = p.hero_image || (p.images?.length === 1 ? p.images[0] : "") || "";

  return (
    <Link
      to="/properties/$slug"
      params={{ slug: p.slug ?? p.id }}
      className="group block overflow-hidden rounded-2xl bg-[#141414] ring-1 ring-white/10 transition hover:ring-[#c6f135]/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1c1c1c]">
        {img ? (
          <img
            src={img}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/40">No image</div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
          {propertyTypeLabel(p.property_type)} ·{" "}
          {p.listing_type === "sale" ? "For Sale" : p.listing_type === "rent" ? "For Rent" : "Short Let"}
        </div>
      </div>
      <div className="p-6">
        <div className="text-lg font-semibold text-white">{p.title}</div>
        {p.city && (
          <div className="mt-1 flex items-center gap-1 text-sm text-white/50">
            <MapPin className="h-3.5 w-3.5" /> {p.city}
            {p.country ? `, ${p.country}` : ""}
          </div>
        )}
        <div className="mt-4 text-2xl font-bold text-[#c6f135]">
          {formatPrice(Number(p.price), p.currency, p.listing_type)}
        </div>
        <div className="mt-4 flex items-center gap-5 text-xs text-white/45">
          {p.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5" /> {p.bedrooms}
            </span>
          )}
          {p.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5" /> {p.bathrooms}
            </span>
          )}
          {p.area_sqm != null && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-3.5 w-3.5" /> {Number(p.area_sqm).toLocaleString()} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
