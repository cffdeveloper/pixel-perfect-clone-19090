import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { listProperties } from "@/lib/properties.functions";
import heroImg from "@/assets/hero-villa.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Offshore Properties — Curated coastal real estate" },
      { name: "description", content: "Discover handpicked villas, apartments, and land along the world's most desirable coastlines." },
      { property: "og:title", content: "Offshore Properties" },
      { property: "og:description", content: "Curated coastal real estate for those who value perspective." },
    ],
  }),
  component: Index,
});

function Index() {
  const fetchProperties = useServerFn(listProperties);
  const { data: featured } = useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => fetchProperties({ data: { featuredOnly: false, limit: 6 } }),
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        <img src={heroImg} alt="Oceanfront villa at sunset" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24">
          <div className="max-w-2xl text-background">
            <div className="mb-6 text-xs uppercase tracking-[0.3em] text-brass">Curated Coastal Real Estate</div>
            <h1 className="font-display text-5xl leading-[1.05] text-balance md:text-7xl">
              A perspective worth waking up to.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-background/80">
              Handpicked villas, oceanfront apartments, and rare plots of land — represented with the care they deserve.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/properties" className="inline-flex items-center gap-2 rounded-sm bg-brass px-7 py-3.5 text-sm uppercase tracking-wide text-primary-foreground transition-smooth hover:bg-brass/90">
                Explore listings <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-sm border border-background/60 px-7 py-3.5 text-sm uppercase tracking-wide text-background transition-smooth hover:bg-background/10">
                Speak with us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-brass">The Collection</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Recently listed</h2>
          </div>
          <Link to="/properties" className="hidden text-sm uppercase tracking-wide text-foreground/70 hover:text-brass md:inline">
            View all →
          </Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured?.length ? (
            featured.map((p) => <PropertyCard key={p.id} p={p} />)
          ) : (
            <div className="col-span-full rounded-sm border border-dashed border-border p-12 text-center text-muted-foreground">
              No properties yet. Sign in to <Link to="/admin/login" className="text-brass underline">the admin portal</Link> to add the first listing.
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
