import { Link } from "@tanstack/react-router";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Star,
  LandPlot,
} from "lucide-react";
import {
  formatPrice,
  formatArea,
  propertyTypeLabel,
  statusLabel,
  listingTypeShort,
  propertyLocationLine,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export type PropertyCardData = {
  id: string;
  slug: string | null;
  title: string;
  property_type: string;
  listing_type: string;
  status?: string | null;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  plot_size_sqm?: number | null;
  address?: string | null;
  city: string | null;
  country: string | null;
  description?: string | null;
  features?: string[] | null;
  hero_image: string | null;
  images: string[] | null;
  is_featured?: boolean | null;
};

function cardImage(p: PropertyCardData) {
  const raw = p.hero_image || p.images?.find((u) => u && !u.includes(",")) || "";
  return raw;
}

function statusTone(status: string) {
  if (status === "available") return "bg-[#c6f135]/20 text-[#c6f135]";
  if (status === "under_offer") return "bg-amber-500/20 text-amber-300";
  return "bg-white/10 text-white/55";
}

export function PropertyCard({ p }: { p: PropertyCardData; variant?: "light" | "dark" }) {
  const img = cardImage(p);
  const location = propertyLocationLine(p);
  const area = formatArea(p.area_sqm);
  const plot = formatArea(p.plot_size_sqm);
  const isLand = p.property_type === "land";
  const features = (p.features ?? []).filter(Boolean).slice(0, 4);
  const extraFeatures = (p.features?.length ?? 0) - features.length;
  const status = p.status ?? "available";
  const desc = p.description?.trim();

  type Stat = "bed" | "bath" | "area" | "plot";
  const stats: { kind: Stat; label: string }[] = [];
  if (!isLand && p.bedrooms != null) stats.push({ kind: "bed", label: `${p.bedrooms} bd` });
  if (!isLand && p.bathrooms != null) stats.push({ kind: "bath", label: `${p.bathrooms} ba` });
  if (area) stats.push({ kind: "area", label: area });
  if (plot && plot !== area) stats.push({ kind: "plot", label: plot });

  function StatIcon({ kind }: { kind: Stat }) {
    const cls = "h-3 w-3";
    if (kind === "bed") return <Bed className={cls} />;
    if (kind === "bath") return <Bath className={cls} />;
    if (kind === "plot") return <LandPlot className={cls} />;
    return <Maximize className={cls} />;
  }

  return (
    <Link
      to="/properties/$slug"
      params={{ slug: p.slug ?? p.id }}
      className="group flex overflow-hidden rounded-xl bg-[#141414] ring-1 ring-white/10 transition hover:ring-[#c6f135]/45"
    >
      <div className="relative h-[108px] w-[108px] shrink-0 bg-[#1c1c1c] sm:h-[120px] sm:w-[128px]">
        {img ? (
          <img
            src={img}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-white/35">
            No image
          </div>
        )}
        {p.is_featured && (
          <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#c6f135] text-[#0a0a0a]">
            <Star className="h-3 w-3 fill-current" aria-hidden />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-2.5 sm:gap-1.5 sm:px-3.5 sm:py-3">
        <div className="flex flex-wrap items-center gap-1">
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/80">
            {propertyTypeLabel(p.property_type)}
          </span>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white/55">
            {listingTypeShort(p.listing_type)}
          </span>
          {status !== "available" && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
                statusTone(status),
              )}
            >
              {statusLabel(status)}
            </span>
          )}
        </div>

        <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-white sm:text-[15px]">
          {p.title}
        </h3>

        {location && (
          <p className="flex items-start gap-1 text-[11px] leading-tight text-white/45">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            <span className="line-clamp-1">{location}</span>
          </p>
        )}

        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
          <p className="text-base font-bold leading-none text-[#c6f135] sm:text-lg">
            {formatPrice(Number(p.price), p.currency, p.listing_type)}
          </p>
          {stats.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/45">
              {stats.map((s) => (
                <li key={s.label} className="flex items-center gap-0.5">
                  <StatIcon kind={s.kind} />
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {features.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {features.map((f) => (
              <li
                key={f}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/55"
              >
                {f}
              </li>
            ))}
            {extraFeatures > 0 && (
              <li className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">
                +{extraFeatures}
              </li>
            )}
          </ul>
        )}

        {desc && (
          <p className="line-clamp-2 text-[10px] leading-snug text-white/35">{desc}</p>
        )}
      </div>
    </Link>
  );
}
