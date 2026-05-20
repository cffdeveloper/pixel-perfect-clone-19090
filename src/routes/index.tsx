import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { listProperties } from "@/lib/properties.functions";
import heroImg from "@/assets/hero-anchor.jpg";
import { ArrowRight, Star } from "lucide-react";

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

      {/* Hero — Anchor Homes style */}
      <section className="relative w-full overflow-hidden bg-[oklch(0.96_0.025_85)]">
        <img
          src={heroImg}
          alt="Modern cantilevered home at golden hour"
          className="absolute inset-y-0 right-0 h-full w-full object-cover md:w-[68%]"
          fetchPriority="high"
        />
        {/* Cream wash for the left readable column */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.96_0.025_85)] via-[oklch(0.96_0.025_85)]/85 to-transparent md:via-[oklch(0.96_0.025_85)]/40 md:to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-6 pt-16 pb-10 md:pt-24 md:pb-12">
          <div className="max-w-3xl">
            <h1 className="font-sans text-5xl font-black uppercase leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-[5.5rem]">
              Find your perfect<br />place to call home
            </h1>
            <Link
              to="/properties"
              className="mt-10 inline-flex items-center gap-3 bg-foreground px-8 py-4 text-sm font-medium text-background transition-smooth hover:bg-foreground/85"
            >
              Book a Call <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Tagline floating right */}
          <div className="pointer-events-none absolute right-6 top-[42%] hidden max-w-[18rem] text-right text-sm leading-relaxed text-background md:block">
            Secure, stylish and smart homes<br />— crafted to give you comfort,<br />trust, and a better life
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid gap-6 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
            <div className="bg-background p-8 shadow-card md:max-w-xs">
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-5xl font-bold tracking-tight text-foreground">4.5</span>
                <Star className="h-5 w-5 fill-foreground text-foreground" />
              </div>
              <p className="mt-3 text-sm leading-snug text-muted-foreground">
                Excellence backed<br />by real client feedback
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 text-background md:gap-12">
              <div className="col-span-3 -mb-2 text-xs uppercase tracking-[0.25em] text-background/90 md:col-span-3">
                Impact in numbers
              </div>
              <div>
                <div className="text-3xl font-bold md:text-4xl">120+</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-background/85">Completed<br />Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold md:text-4xl">94%</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-background/85">Client<br />Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold md:text-4xl">64+</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-background/85">Years of<br />Expertise</div>
              </div>
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
