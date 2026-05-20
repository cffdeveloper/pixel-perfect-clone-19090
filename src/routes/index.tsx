import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { listProperties } from "@/lib/properties.functions";
import heroImg from "@/assets/hero-dream.jpg";
import { Search, User, Menu } from "lucide-react";

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
    <div className="min-h-screen bg-[oklch(0.94_0.005_240)]">
      {/* Hero — Dribbble "Dream Home" style: rounded card with pill nav + centered logo notch */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="relative mx-auto h-[88vh] min-h-[620px] w-full max-w-[1400px] overflow-hidden rounded-[28px] shadow-elevated">
          <img
            src={heroImg}
            alt="Modern oceanfront terrace at twilight"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          {/* Soft bottom gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15" />

          {/* Floating top bar */}
          <div className="absolute left-0 right-0 top-0 z-20 px-5 pt-5 sm:px-8 sm:pt-7">
            <div className="relative flex items-center justify-between gap-3">
              {/* Left pill group */}
              <div className="flex items-center gap-2">
                <button
                  aria-label="Account"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md ring-1 ring-white/30 transition-smooth hover:bg-white/30"
                >
                  <User className="h-4 w-4" />
                </button>
                <div className="hidden items-center rounded-full bg-white/15 px-1.5 py-1 backdrop-blur-md ring-1 ring-white/25 md:flex">
                  {[
                    { label: "Villas", to: "/properties" },
                    { label: "Apartments", to: "/properties" },
                    { label: "Land", to: "/properties" },
                    { label: "Contact", to: "/contact" },
                  ].map((n) => (
                    <Link
                      key={n.label}
                      to={n.to}
                      className="rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/95 transition-smooth hover:bg-white/20"
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Centered logo with notch */}
              <Link
                to="/"
                className="absolute left-1/2 top-0 -translate-x-1/2"
                aria-label="Find Home"
              >
                <div className="relative">
                  <div className="flex items-center gap-2 rounded-b-2xl bg-background px-7 pb-3 pt-4 shadow-card">
                    <span className="grid h-6 w-6 place-items-center">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="currentColor">
                        <path d="M3 18 8 6l4 8 4-8 5 12h-3l-2-5-2 4-2-4-2 5z" />
                      </svg>
                    </span>
                    <span className="font-display text-lg leading-none tracking-tight text-foreground">
                      Offshore
                    </span>
                  </div>
                </div>
              </Link>

              {/* Right cluster: search + login + menu */}
              <div className="flex items-center gap-2">
                <div className="hidden h-11 items-center gap-2 rounded-full bg-white/20 pl-5 pr-2 text-white backdrop-blur-md ring-1 ring-white/30 lg:flex">
                  <input
                    type="text"
                    placeholder="Describe your ideal coastline, view, or budget…"
                    className="w-72 bg-transparent text-xs text-white placeholder:text-white/80 focus:outline-none"
                  />
                  <button
                    aria-label="Search"
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Link
                  to="/admin/login"
                  className="hidden h-11 items-center rounded-full bg-white/20 px-5 text-xs font-medium uppercase tracking-[0.14em] text-white backdrop-blur-md ring-1 ring-white/30 transition-smooth hover:bg-white/30 sm:inline-flex"
                >
                  Login
                </Link>
                <button
                  aria-label="Menu"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md ring-1 ring-white/30 transition-smooth hover:bg-white/30"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom-left headline */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 sm:px-12 sm:pb-14">
            <h1 className="font-display text-6xl font-light leading-[0.95] tracking-tight text-white sm:text-7xl md:text-[7.5rem] lg:text-[9rem]">
              Offshore Properties
            </h1>
            <p className="mt-5 max-w-xl text-xs leading-relaxed text-white/85 sm:text-sm">
              A curated collection of villas, oceanfront apartments and rare plots
              of land — represented with the care and discretion they deserve.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/properties"
                className="inline-flex h-11 items-center rounded-full bg-white px-6 text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-smooth hover:bg-white/90"
              >
                Browse the collection
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-11 items-center rounded-full bg-white/15 px-6 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md ring-1 ring-white/40 transition-smooth hover:bg-white/25"
              >
                Speak with an advisor
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
