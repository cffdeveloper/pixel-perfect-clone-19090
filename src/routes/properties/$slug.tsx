import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { getPropertyBySlug, recordPropertyView } from "@/lib/properties.functions";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { ViewingForm } from "@/components/viewing-form";
import { formatPrice, propertyTypeLabel, statusLabel } from "@/lib/format";
import { PropertyActions } from "@/components/property-actions";
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/properties/$slug")({
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
      <SiteLayout>
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6">
          <div className="aspect-[16/9] rounded-2xl bg-white/5" />
        </div>
      </SiteLayout>
    );
  }

  if (error || !p) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-white">Property not found</h1>
          <Link to="/properties" className="mt-6 inline-block text-[#c6f135]">
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
    agency: string | null;
  } | null;

  return (
    <SiteLayout>
      <article>
        <div className="relative aspect-[4/3] bg-[#141414] sm:aspect-[21/9]">
          {images[0] ? (
            <img src={images[0]} alt={p.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/40">No image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <Link
              to="/properties"
              className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Collection
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/95 text-[#0a0a0a]">{propertyTypeLabel(p.property_type)}</Badge>
              <Badge variant="outline" className="border-white/40 text-white">
                {statusLabel(p.status)}
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl text-balance">
              {p.title}
            </h1>
            {p.city && (
              <p className="mt-2 flex items-center gap-2 text-white/85">
                <MapPin className="h-4 w-4" /> {p.city}
                {p.country ? `, ${p.country}` : ""}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-3 py-8 safe-bottom sm:px-6 sm:py-12 lg:grid-cols-3 lg:gap-12 lg:py-16">
          <div className="lg:col-span-2">
            <p className="text-4xl font-bold text-[#c6f135]">
              {formatPrice(Number(p.price), p.currency, p.listing_type)}
            </p>
            <div className="mt-6">
              <PropertyActions propertyId={p.id} />
            </div>
            {p.latitude != null && p.longitude != null && (
              <div className="mt-6">
                <Link to="/map">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full border-white/15 text-white hover:bg-white/10"
                  >
                    <Map className="h-4 w-4" />
                    View on property map
                  </Button>
                </Link>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <iframe
                    title="Location"
                    className="h-48 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}&q=${p.latitude},${p.longitude}&zoom=14`}
                  />
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/50">
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
                  <Maximize className="h-4 w-4 text-[#c6f135]" /> {Number(p.area_sqm).toLocaleString()} m²
                </span>
              )}
            </div>
            {p.description && (
              <p className="mt-10 whitespace-pre-wrap text-base leading-relaxed text-white/60">{p.description}</p>
            )}
            {(p.features?.length ?? 0) > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wider text-white/70"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {images.length > 1 && (
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {images.slice(1, 5).map((src) => (
                  <img key={src} src={src} alt="" className="aspect-[4/3] rounded-lg object-cover" loading="lazy" />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {agent && (
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
                <p className="text-xs uppercase tracking-wider text-[#c6f135]">Your advisor</p>
                <p className="mt-2 text-xl font-semibold text-white">{agent.name}</p>
                {agent.agency && <p className="text-sm text-white/50">{agent.agency}</p>}
                <a href={`mailto:${agent.email}`} className="mt-3 block text-sm text-[#c6f135] hover:underline">
                  {agent.email}
                </a>
              </div>
            )}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
              <Tabs defaultValue="enquiry">
                <TabsList className="grid w-full grid-cols-2 bg-[#0a0a0a]">
                  <TabsTrigger value="enquiry">Enquire</TabsTrigger>
                  <TabsTrigger value="viewing">Viewing</TabsTrigger>
                </TabsList>
                <TabsContent value="enquiry" className="mt-6">
                  <EnquiryForm propertyId={p.id} />
                </TabsContent>
                <TabsContent value="viewing" className="mt-6">
                  <ViewingForm propertyId={p.id} />
                </TabsContent>
              </Tabs>
            </div>
          </aside>
        </div>
      </article>
    </SiteLayout>
  );
}
