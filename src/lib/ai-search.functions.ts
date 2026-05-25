import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAnonServer } from "@/integrations/supabase/client.anon-server";
import { rateLimit } from "@/lib/rate-limit";

const Schema = z.object({
  query: z.string().min(1).max(500),
});

/**
 * AI-powered natural language property search.
 * Calls Lovable AI Gateway with a compact catalog summary and returns
 * the AI's text response + the matched property IDs.
 */
export const aiSearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    rateLimit("ai-search", 10, 60_000);

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    const { data: rows, error } = await supabaseAnonServer
      .from("properties")
      .select("id, slug, title, property_type, listing_type, price, currency, bedrooms, bathrooms, area_sqm, city, country, features, description")
      .eq("is_published", true)
      .limit(80);
    if (error) throw error;

    const catalog = (rows ?? []).map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      type: r.property_type,
      listing: r.listing_type,
      price: `${r.price} ${r.currency}`,
      beds: r.bedrooms, baths: r.bathrooms,
      area: r.area_sqm,
      city: r.city, country: r.country,
      features: (r.features ?? []).slice(0, 10),
      summary: (r.description ?? "").slice(0, 240),
    }));

    const sys = `You are the Offshore Properties concierge. The user will describe what they want in natural language (any language). Reply in their language, briefly recommend 1-5 best matches from the JSON catalog below, and explain why. Always end with a JSON line: MATCHES:["slug1","slug2"]. Only include slugs that exist in the catalog.\n\nCATALOG:\n${JSON.stringify(catalog)}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: data.query },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Search is busy — please retry in a moment.");
    if (res.status === 402) throw new Error("AI usage limit reached. Please add credits.");
    if (!res.ok) throw new Error(`AI error ${res.status}`);

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    const match = content.match(/MATCHES:\s*(\[[^\]]*\])/);
    let slugs: string[] = [];
    if (match) {
      try { slugs = JSON.parse(match[1]); } catch { /* ignore */ }
    }
    const reply = content.replace(/MATCHES:\s*\[[^\]]*\]/, "").trim();

    let matches: Array<{ id: string; slug: string | null; title: string; hero_image: string | null; city: string | null; price: number; currency: string; listing_type: string }> = [];
    if (slugs.length) {
      const { data: m } = await supabaseAnonServer
        .from("properties")
        .select("id, slug, title, hero_image, city, price, currency, listing_type")
        .in("slug", slugs)
        .eq("is_published", true);
      matches = m ?? [];
    }
    return { reply, matches };
  });
