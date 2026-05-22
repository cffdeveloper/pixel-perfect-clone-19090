import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { aiSearch } from "@/lib/ai-search.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sparkles, Loader2, Send } from "lucide-react";
import { formatPrice } from "@/lib/format";

export function AiAssistant({ trigger }: { trigger?: React.ReactNode }) {
  const runAi = useServerFn(aiSearch);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [matches, setMatches] = useState<
    Array<{
      id: string;
      slug: string | null;
      title: string;
      hero_image: string | null;
      city: string | null;
      price: number;
      currency: string;
      listing_type: string;
    }>
  >([]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setReply(null);
    setMatches([]);
    try {
      const result = await runAi({ data: { query: q } });
      setReply(result.reply);
      setMatches(result.matches ?? []);
    } catch (err) {
      setReply(err instanceof Error ? err.message : "Search unavailable. Try browsing the collection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button className="fab-safe fixed z-50 h-12 max-w-[calc(100vw-2rem)] gap-2 rounded-full bg-[#c6f135] px-4 text-sm font-semibold text-[#0a0a0a] shadow-elevated hover:bg-[#d4ff4a] sm:bottom-6 sm:right-6 sm:h-14 sm:max-w-none sm:px-5">
            <Sparkles className="h-5 w-5" />
            AI Assistant
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left">
            <Sparkles className="h-5 w-5 text-[#c6f135]" />
            Property concierge
          </SheetTitle>
        </SheetHeader>
        <p className="text-sm text-muted-foreground">
          Describe your dream property in everyday language — location, budget, lifestyle, views.
        </p>
        <form onSubmit={handleAsk} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Modern villa with sea view in Portugal under $2M…"
            rows={3}
            className="min-h-[88px] flex-1 resize-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading}
            className="h-11 w-full shrink-0 rounded-full bg-[#c6f135] text-[#0a0a0a] hover:bg-[#d4ff4a] sm:h-10 sm:w-10"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <div className="mt-6 flex-1 overflow-y-auto">
          {reply && (
            <div className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed whitespace-pre-wrap">{reply}</div>
          )}
          {matches.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Matches</p>
              {matches.map((m) => (
                <Link
                  key={m.id}
                  to="/properties/$slug"
                  params={{ slug: m.slug ?? m.id }}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 rounded-xl border border-border p-3 transition hover:bg-muted/50"
                >
                  {m.hero_image && (
                    <img src={m.hero_image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-medium leading-snug">{m.title}</p>
                    <p className="text-sm text-[#3d5c00]">{formatPrice(Number(m.price), m.currency, m.listing_type)}</p>
                    {m.city && <p className="text-xs text-muted-foreground">{m.city}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
