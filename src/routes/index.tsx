import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { HavenlyHero } from "@/components/home/havenly-hero";
import { HomeTabStrip } from "@/components/home/home-tab-strip";
import { PropertyCard } from "@/components/property-card";
import { listProperties } from "@/lib/properties.functions";
import { BRAND, HAVENLY_HERO_RENT, HAVENLY_HERO_SALE } from "@/lib/constants";
import type { HomeTab } from "@/components/public-header";
import { z } from "zod";

const homeSearchSchema = z.object({
  tab: z.enum(["all", "buy", "rent"]).optional().catch("all"),
});

export const Route = createFileRoute("/")({
  validateSearch: (s) => homeSearchSchema.parse(s),
  head: () => ({
    meta: [
      { title: `${BRAND.name} — Real Estate Made Easy & Transparent` },
      {
        name: "description",
        content: "Our smart platform simplifies your search, offering handpicked listings.",
      },
    ],
  }),
  component: Index,
});

function propertyImage(p: { hero_image: string | null; images: string[] | null }) {
  if (p.hero_image) return p.hero_image;
  const first = p.images?.find((url) => url && !url.includes(","));
  return first ?? "";
}

function Index() {
  const { tab: urlTab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [homeTab, setHomeTab] = useState<HomeTab>(urlTab ?? "all");
  const fetchProperties = useServerFn(listProperties);

  useEffect(() => {
    setHomeTab(urlTab ?? "all");
  }, [urlTab]);

  function setTab(tab: HomeTab) {
    setHomeTab(tab);
    navigate({ search: { tab } });
  }

  const { data: all = [], isLoading } = useQuery({
    queryKey: ["properties", "home-all"],
    queryFn: () => fetchProperties({ data: { limit: 48 } }),
  });

  const listings = useMemo(() => {
    if (homeTab === "buy") return all.filter((p) => p.listing_type === "sale");
    if (homeTab === "rent") return all.filter((p) => p.listing_type === "rent");
    return all;
  }, [all, homeTab]);

  const heroImage =
    homeTab === "rent" ? HAVENLY_HERO_RENT : homeTab === "buy" ? HAVENLY_HERO_SALE : HAVENLY_HERO_SALE;

  const sectionTitle =
    homeTab === "buy" ? "Homes for sale" : homeTab === "rent" ? "Homes for rent" : "All listings";

  const collectionSearch =
    homeTab === "buy"
      ? { listingType: "sale" as const }
      : homeTab === "rent"
        ? { listingType: "rent" as const }
        : {};

  return (
    <div className="min-h-screen bg-[#c8c8c8]">
      <HavenlyHero homeTab={homeTab} onHomeTabChange={setTab} heroImage={heroImage} />

      <HomeTabStrip active={homeTab} onChange={setTab} />

      <section className="px-2 pb-8 safe-bottom sm:px-4 md:px-5 lg:px-6 sm:pb-10">
        <div className="mx-auto max-w-[1440px] rounded-[24px] bg-[#0a0a0a] px-4 py-8 sm:rounded-[40px] sm:px-8 sm:py-12 lg:rounded-[48px] lg:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#c6f135]">
                {listings.length} {listings.length === 1 ? "property" : "properties"}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {sectionTitle}
              </h2>
            </div>
            <Link
              to="/properties"
              search={collectionSearch}
              className="text-sm font-medium text-white/60 transition hover:text-[#c6f135]"
            >
              View full collection →
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[108px] animate-pulse rounded-xl bg-white/5 sm:h-[120px]" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-white/15 py-12 text-center text-sm text-white/50">
              {all.length === 0
                ? "No published listings yet. Add and publish properties in admin."
                : `No ${homeTab === "buy" ? "sale" : "rent"} listings — try All or the other tab.`}
            </p>
          ) : (
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {listings.map((p) => (
                <PropertyCard
                  key={p.id}
                  p={{ ...p, hero_image: propertyImage(p) || p.hero_image }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
