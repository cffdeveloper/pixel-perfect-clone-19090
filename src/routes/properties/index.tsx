import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listProperties } from "@/lib/properties.functions";
import { SiteLayout } from "@/components/site-layout";
import { PropertyCard } from "@/components/property-card";
import { PropertyFilters, type PropertySearch } from "@/components/property-filters";
import { SectionHeading } from "@/components/section-heading";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { AiSearchField } from "@/components/ai-search-field";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
  propertyType: z.string().optional(),
  listingType: z.string().optional(),
  city: z.string().optional(),
  maxPrice: z.string().optional(),
  ai: z.string().optional(),
});

export const Route = createFileRoute("/properties/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: `Collection — ${BRAND.name}` },
      { name: "description", content: "Browse curated coastal villas, apartments, and land." },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const fetch = useServerFn(listProperties);

  const filters = {
    query: search.q,
    propertyType: search.propertyType,
    listingType: search.listingType,
    city: search.city,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
  };

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () =>
      fetch({
        data: {
          query: filters.query,
          propertyType: filters.propertyType,
          listingType: filters.listingType,
          city: filters.city,
          maxPrice: filters.maxPrice,
          limit: 60,
        },
      }),
  });

  function setSearch(patch: Partial<PropertySearch>) {
    navigate({ search: (prev) => ({ ...prev, ...patch }) });
  }

  function reset() {
    navigate({ search: {} });
  }

  const values: PropertySearch = {
    q: search.q,
    propertyType: search.propertyType,
    listingType: search.listingType,
    city: search.city,
  };

  return (
    <SiteLayout>
      <section className="border-b border-white/10 px-3 py-8 sm:px-6 sm:py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <SectionHeading
            eyebrow="The collection"
            title="Coastal properties"
            description="Every listing is vetted for location, craft, and long-term value."
          />
          <div className="flex flex-wrap gap-2">
            <Link to="/map">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-white/15 text-white hover:bg-white/10"
              >
                <Map className="h-4 w-4" /> View map
              </Button>
            </Link>
            <AiSearchField variant="compact" className="w-full sm:max-w-sm" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-8 safe-bottom sm:px-6 sm:py-14">
        <PropertyFilters values={values} onChange={setSearch} onReset={reset} />
        {search.ai && search.q && (
          <p className="mt-4 text-sm text-white/50">
            Showing results for AI search: <span className="text-white">&ldquo;{search.q}&rdquo;</span>
          </p>
        )}
        {isLoading ? (
          <div className="mt-8 grid gap-3 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[108px] animate-pulse rounded-xl bg-white/5 sm:h-[120px]" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-white/15 p-16 text-center">
            <p className="text-2xl font-bold text-white">No matches found</p>
            <p className="mt-2 text-sm text-white/50">Adjust filters or explore all listings.</p>
            <Link
              to="/properties"
              search={{}}
              className="mt-6 inline-block text-sm uppercase tracking-wider text-[#c6f135]"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-white/50">{properties.length} properties</p>
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {properties.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
