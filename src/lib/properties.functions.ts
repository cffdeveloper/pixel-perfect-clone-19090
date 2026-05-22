import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdminAuth } from "@/integrations/supabase/admin-middleware";

const FilterSchema = z.object({
  query: z.string().max(200).optional(),
  propertyType: z.string().max(50).optional(),
  listingType: z.string().max(50).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  city: z.string().max(100).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  featuredOnly: z.boolean().optional(),
});

export type PropertyFilters = z.infer<typeof FilterSchema>;

export const listProperties = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => FilterSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("properties")
      .select(
        "id, title, slug, property_type, listing_type, status, price, currency, bedrooms, bathrooms, area_sqm, city, country, hero_image, images, is_featured, latitude, longitude, created_at",
      )
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 60);

    if (data.propertyType && data.propertyType !== "any") q = q.eq("property_type", data.propertyType);
    if (data.listingType && data.listingType !== "any") q = q.eq("listing_type", data.listingType);
    if (data.minPrice != null) q = q.gte("price", data.minPrice);
    if (data.maxPrice != null) q = q.lte("price", data.maxPrice);
    if (data.bedrooms != null) q = q.gte("bedrooms", data.bedrooms);
    if (data.bathrooms != null) q = q.gte("bathrooms", data.bathrooms);
    if (data.city) q = q.ilike("city", `%${data.city}%`);
    if (data.featuredOnly) q = q.eq("is_featured", true);
    if (data.query) q = q.or(`title.ilike.%${data.query}%,description.ilike.%${data.query}%,city.ilike.%${data.query}%`);

    const { data: rows, error } = await q;
    if (error) throw error;
    return rows ?? [];
  });

export const getPropertyBySlug = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("properties")
      .select("*, agents(id, name, email, phone, whatsapp, agency, bio, photo_url)")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return row;
  });

export const recordPropertyView = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ propertyId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await supabaseAdmin.from("property_views").insert({ property_id: data.propertyId });
    return { ok: true };
  });

const LeadSchema = z.object({
  client_name: z.string().min(1).max(200),
  client_email: z.string().email().max(320),
  client_phone: z.string().max(40).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  source: z.enum(["enquiry", "contact", "ai_chat", "booking"]).default("enquiry"),
  property_id: z.string().uuid().optional().nullable(),
});

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("leads").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const BookingSchema = z.object({
  client_name: z.string().min(1).max(200),
  client_email: z.string().email().max(320),
  client_phone: z.string().max(40).optional().nullable(),
  property_id: z.string().uuid(),
  requested_at: z.string().datetime(),
  notes: z.string().max(2000).optional().nullable(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("bookings").insert({
      ...data,
      requested_at: new Date(data.requested_at).toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Admin-only: list everything including drafts
export const adminListProperties = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("properties")
      .select("id, title, slug, property_type, listing_type, status, price, currency, city, hero_image, is_published, is_featured, view_count, latitude, longitude, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminGetProperty = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("properties").select("*").eq("id", data.id).maybeSingle();
    if (error) throw error;
    return row;
  });

const PropertyInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  property_type: z.string().min(1).max(40),
  listing_type: z.string().min(1).max(40),
  status: z.string().min(1).max(40),
  price: z.number().nonnegative(),
  currency: z.string().min(3).max(3),
  bedrooms: z.number().int().min(0).max(50).nullable().optional(),
  bathrooms: z.number().int().min(0).max(50).nullable().optional(),
  area_sqm: z.number().nonnegative().nullable().optional(),
  plot_size_sqm: z.number().nonnegative().nullable().optional(),
  year_built: z.number().int().nullable().optional(),
  furnishing_status: z.string().max(40).nullable().optional(),
  parking_spaces: z.number().int().min(0).max(20).nullable().optional(),
  short_let_min_nights: z.number().int().min(0).max(365).nullable().optional(),
  address: z.string().max(300).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  country: z.string().max(100).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  description: z.string().max(8000).nullable().optional(),
  features: z.array(z.string().max(60)).max(50).default([]),
  images: z.array(z.string().max(2000)).max(40).default([]),
  hero_image: z.string().max(2000).nullable().optional(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  agent_id: z.string().uuid().nullable().optional(),
});

export const upsertProperty = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) => PropertyInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { error, data: row } = await supabaseAdmin
      .from("properties").upsert(data).select("id, slug").single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteProperty = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("properties").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const setPropertyPublished = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), is_published: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("properties")
      .update({ is_published: data.is_published })
      .eq("id", data.id)
      .select("id, slug, is_published")
      .single();
    if (error) throw error;
    return row;
  });

export const adminListLeads = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*, properties(title, slug)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminUpdateLead = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["new","contacted","viewing_scheduled","offer_made","closed_won","closed_lost"]).optional(),
      notes: z.string().max(5000).optional().nullable(),
    }).parse(input))
  .handler(async ({ data }) => {
    const { id, ...patch } = data;
    const { error } = await supabaseAdmin.from("leads").update(patch).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

export const adminListBookings = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*, properties(title, slug)")
      .order("requested_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const adminUpdateBooking = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending","confirmed","cancelled","completed"]),
    }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("bookings").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const [p, l, b, v] = await Promise.all([
      supabaseAdmin.from("properties").select("id, is_published, view_count"),
      supabaseAdmin.from("leads").select("id, status, created_at"),
      supabaseAdmin.from("bookings").select("id, status, requested_at"),
      supabaseAdmin.from("property_views").select("id, created_at").gte("created_at", new Date(Date.now() - 30 * 86400_000).toISOString()),
    ]);
    return {
      properties: p.data ?? [],
      leads: l.data ?? [],
      bookings: b.data ?? [],
      recentViews: v.data ?? [],
    };
  });