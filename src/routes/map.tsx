import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { PropertiesMap } from "@/components/properties-map";
import { listPropertiesForMap } from "@/lib/social.functions";
import { BRAND } from "@/lib/constants";
import { AiAssistant } from "@/components/ai-assistant";
import { Map, Sparkles } from "lucide-react";
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
      <section className="mx-auto max-w-7xl px-3 py-8 safe-bottom sm:px-6 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#c6f135]">Explore</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <Map className="h-8 w-8" />
              Property map
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/50">
              Every pin is a published listing. Colors indicate property type — tap a pin for details.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/properties">
              <Button variant="outline" className="rounded-full border-white/15 text-white hover:bg-white/10">
                List view
              </Button>
            </Link>
            <AiAssistant
              trigger={
                <Button className="gap-2 rounded-full bg-[#c6f135] text-[#0a0a0a] hover:bg-[#d4ff4a]">
                  <Sparkles className="h-4 w-4" />
                  AI search
                </Button>
              }
            />
          </div>
        </div>
        <div className="mt-8">
          {isLoading ? (
            <div className="h-[480px] animate-pulse rounded-2xl bg-white/5" />
          ) : (
            <PropertiesMap properties={properties} />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
