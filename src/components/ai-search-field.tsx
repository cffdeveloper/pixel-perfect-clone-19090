import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { aiSearch } from "@/lib/ai-search.functions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Match = {
  id: string;
  slug: string | null;
  title: string;
  hero_image: string | null;
  city: string | null;
  price: number;
  currency: string;
  listing_type: string;
};

export function AiSearchField({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "compact";
  className?: string;
}) {
  const runAi = useServerFn(aiSearch);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  async function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setOpen(true);
    setLoading(true);
    setReply(null);
    setMatches([]);
    try {
      const result = await runAi({ data: { query: trimmed } });
      setReply(result.reply);
      setMatches(result.matches ?? []);
    } catch (err) {
      setReply(err instanceof Error ? err.message : "Search unavailable. Try browsing the collection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await runSearch(input);
  }

  const isHero = variant === "hero";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex w-full items-center gap-2 overflow-hidden rounded-2xl bg-[#141414]/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-md",
          isHero ? "px-4 py-2.5 sm:rounded-full sm:py-2" : "rounded-full px-3 py-1.5",
          className,
        )}
      >
        <Sparkles
          className={cn("shrink-0 text-[#c6f135]", isHero ? "h-5 w-5" : "h-4 w-4")}
          aria-hidden
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Use AI to find your dream home…"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-white placeholder:text-white/45 focus:outline-none",
            isHero ? "text-sm sm:text-base" : "text-sm",
          )}
          aria-label="Describe your dream property"
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !input.trim()}
          className={cn(
            "shrink-0 rounded-full bg-[#c6f135] text-[#0a0a0a] hover:bg-[#d4ff4a] disabled:opacity-50",
            isHero ? "h-10 w-10" : "h-9 w-9",
          )}
          aria-label="Search with AI"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col border-white/10 bg-[#141414] text-white sm:max-w-md"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-left text-white">
              <Sparkles className="h-5 w-5 text-[#c6f135]" />
              Dream home search
            </SheetTitle>
          </SheetHeader>
          {query && (
            <p className="text-sm text-white/50">
              &ldquo;{query}&rdquo;
            </p>
          )}
          <div className="mt-4 flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Loader2 className="h-4 w-4 animate-spin text-[#c6f135]" />
                Finding properties that match…
              </div>
            )}
            {reply && !loading && (
              <div className="rounded-xl bg-white/5 p-4 text-sm leading-relaxed whitespace-pre-wrap text-white/90">
                {reply}
              </div>
            )}
            {matches.length > 0 && !loading && (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-[#c6f135]">Matches</p>
                {matches.map((m) => (
                  <Link
                    key={m.id}
                    to="/properties/$slug"
                    params={{ slug: m.slug ?? m.id }}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                  >
                    {m.hero_image && (
                      <img src={m.hero_image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium leading-snug">{m.title}</p>
                      <p className="text-sm text-[#c6f135]">
                        {formatPrice(Number(m.price), m.currency, m.listing_type)}
                      </p>
                      {m.city && <p className="text-xs text-white/50">{m.city}</p>}
                    </div>
                  </Link>
                ))}
                <Link
                  to="/properties"
                  search={{ q: query, ai: "1" }}
                  onClick={() => setOpen(false)}
                  className="block text-center text-sm font-medium text-[#c6f135] underline"
                >
                  View all matching listings →
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
