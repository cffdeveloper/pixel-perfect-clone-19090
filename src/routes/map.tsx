import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { PropertiesMap } from "@/components/properties-map";
import { listPropertiesForMap } from "@/lib/social.functions";
import { BRAND } from "@/lib/constants";
import { AiSearchField } from "@/components/ai-search-field";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/map")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `Property map — ${BRAND.name}` },
      { name: "description", content: "Explore all listings on an interactive map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const fetch = useServerFn(listPropertiesForMap);
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["map-properties"],
    queryFn: () => fetch(),
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-6 safe-bottom sm:px-6 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#c6f135]">Explore</p>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              <Map className="h-6 w-6 sm:h-8 sm:w-8" />
              Property map
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/50">
              Every pin is a published listing. Tap a pin for details.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link to="/properties">
              <Button variant="outline" className="h-11 w-full rounded-full border-white/15 text-white hover:bg-white/10 sm:w-auto">
                List view
              </Button>
            </Link>
            <AiSearchField variant="compact" className="w-full sm:max-w-xs" />
          </div>
        </div>
        <div className="mt-6 sm:mt-8">
          {isLoading ? (
            <div className="h-[60vh] max-h-[480px] min-h-[280px] animate-pulse rounded-2xl bg-white/5" />
          ) : (
            <div className="h-[60vh] max-h-[600px] min-h-[280px] overflow-hidden rounded-2xl">
              <PropertiesMap properties={properties} />
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
