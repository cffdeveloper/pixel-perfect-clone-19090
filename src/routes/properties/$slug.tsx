import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { getPropertyBySlug, recordPropertyView } from "@/lib/properties.functions";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { ViewingForm } from "@/components/viewing-form";
import { formatPrice, formatArea, propertyTypeLabel, statusLabel } from "@/lib/format";
import { PropertyActions } from "@/components/property-actions";
import { BRAND } from "@/lib/constants";
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/properties/$slug")({
  head: ({ params }) => {
    const readable = params.slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${readable} | ${BRAND.name}` },
        { name: "description", content: `${readable} — ${BRAND.tagline}` },
      ],
    };
  },
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { slug } = Route.useParams();
  const fetch = useServerFn(getPropertyBySlug);
  const track = useServerFn(recordPropertyView);

  const { data: p, isLoading, error } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => fetch({ data: { slug } }),
  });

  useEffect(() => {
    if (p?.id) track({ data: { propertyId: p.id } }).catch(() => {});
  }, [p?.id, track]);

  if (isLoading) {
    return (
      <SiteLayout showFooter={false}>
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6">
          <div className="aspect-[16/9] rounded-2xl bg-white/5" />
        </div>
      </SiteLayout>
    );
  }

  if (error || !p) {
    return (
      <SiteLayout showFooter={false}>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-white">Property not found</h1>
          <Link to="/properties" className="mt-6 inline-flex min-h-[44px] items-center text-[#c6f135]">
            ← Back to collection
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const images = [p.hero_image, ...(p.images ?? [])].filter(Boolean) as string[];
  const agent = p.agents as {
    name: string;
    email: string;
    phone: string | null;
    whatsapp: string | null;
    agency: string | null;
  } | null;

  const whatsappNumber = agent?.whatsapp ?? agent?.phone ?? null;

  return (
    <SiteLayout showFooter={false}>
      <article>
        {/* Hero image */}
        <div className="relative aspect-[4/3] bg-[#141414] sm:aspect-[21/9]">
          {images[0] ? (
            <img src={images[0]} alt={p.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/40">No image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-10">
            <Link
              to="/properties"
              className="mb-3 inline-flex min-h-[44px] items-center gap-2 text-xs uppercase tracking-wider text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Collection
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/95 text-[#0a0a0a]">{propertyTypeLabel(p.property_type)}</Badge>
              <Badge variant="outline" className="border-white/40 text-white">
                {statusLabel(p.status)}
              </Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              {p.title}
            </h1>
            {p.city && (
              <p className="mt-2 flex items-center gap-2 text-sm text-white/85 sm:text-base">
                <MapPin className="h-4 w-4" /> {p.city}
                {p.country ? `, ${p.country}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 safe-bottom sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-3 lg:gap-12 lg:py-16">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-3xl font-bold text-[#c6f135] sm:text-4xl">
                {formatPrice(Number(p.price), p.currency, p.listing_type)}
              </p>
              <PropertyActions propertyId={p.id} />
            </div>

            {/* Stats */}
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/50 sm:gap-6">
              {p.bedrooms != null && (
                <span className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-[#c6f135]" /> {p.bedrooms} beds
                </span>
              )}
              {p.bathrooms != null && (
                <span className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-[#c6f135]" /> {p.bathrooms} baths
                </span>
              )}
              {p.area_sqm != null && (
                <span className="flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-[#c6f135]" /> {formatArea(Number(p.area_sqm), p.property_type)}
                </span>
              )}
              {p.plot_size_sqm != null && Number(p.plot_size_sqm) !== Number(p.area_sqm) && (
                <span className="flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-[#c6f135]" /> {formatArea(Number(p.plot_size_sqm), p.property_type)} plot
                </span>
              )}
            </div>

            {/* Map */}
            {p.latitude != null && p.longitude != null && (
              <div className="mt-6">
                <Link to="/map">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 gap-2 rounded-full border-white/15 text-white hover:bg-white/10"
                  >
                    <Map className="h-4 w-4" />
                    View on property map
                  </Button>
                </Link>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <iframe
                    title="Location"
                    className="h-48 w-full sm:h-56"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}&q=${p.latitude},${p.longitude}&zoom=14`}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {p.description && (
              <p className="mt-8 whitespace-pre-wrap text-[15px] leading-relaxed text-white/60 sm:mt-10 sm:text-base">
                {p.description}
              </p>
            )}

            {/* Features */}
            {(p.features?.length ?? 0) > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                {p.features.map((f: string) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs uppercase tracking-wider text-white/70"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Gallery */}
            {images.length > 1 && (
              <div className="mt-8 grid gap-2 sm:mt-10 sm:grid-cols-2 sm:gap-3">
                {images.slice(1, 5).map((src, i) => (
                  <img key={src} src={src} alt={`${p.title} — photo ${i + 2}`} className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {agent && (
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wider text-[#c6f135]">Your advisor</p>
                <p className="mt-2 text-lg font-semibold text-white sm:text-xl">{agent.name}</p>
                {agent.agency && <p className="text-sm text-white/50">{agent.agency}</p>}
                <a href={`mailto:${agent.email}`} className="mt-3 inline-flex min-h-[44px] items-center text-sm text-[#c6f135] hover:underline">
                  {agent.email}
                </a>
              </div>
            )}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-6">
              <Tabs defaultValue="enquiry">
                <TabsList className="grid w-full grid-cols-2 bg-[#0a0a0a]">
                  <TabsTrigger value="enquiry" className="min-h-[44px]">Enquire</TabsTrigger>
                  <TabsTrigger value="viewing" className="min-h-[44px]">Viewing</TabsTrigger>
                </TabsList>
                <TabsContent value="enquiry" className="mt-5">
                  <EnquiryForm propertyId={p.id} propertyTitle={p.title} whatsapp={whatsappNumber} />
                </TabsContent>
                <TabsContent value="viewing" className="mt-5">
                  <ViewingForm propertyId={p.id} propertyTitle={p.title} whatsapp={whatsappNumber} />
                </TabsContent>
              </Tabs>
            </div>
          </aside>
        </div>
      </article>
    </SiteLayout>
  );
}
