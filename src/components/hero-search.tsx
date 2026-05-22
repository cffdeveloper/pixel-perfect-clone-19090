import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { aiSearch } from "@/lib/ai-search.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function HeroSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const navigate = useNavigate();
  const runAi = useServerFn(aiSearch);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setAiReply(null);
    try {
      const result = await runAi({ data: { query: q } });
      if (result.matches?.length) {
        navigate({
          to: "/properties",
          search: { q, ai: "1" },
        });
        return;
      }
      setAiReply(result.reply || "No exact matches yet — try browsing the full collection.");
    } catch {
      navigate({ to: "/properties", search: { q } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brass" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ocean view villa under $2M in Lisbon…"
            className="h-12 rounded-full border-white/25 bg-white/15 pl-11 text-white placeholder:text-white/70 backdrop-blur-md focus-visible:ring-brass/50"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 shrink-0 rounded-full bg-brass px-6 text-[11px] uppercase tracking-[0.16em] text-primary hover:bg-brass/90"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Search</span>
        </Button>
      </form>
      {aiReply && (
        <p className="mt-3 rounded-lg bg-black/40 px-4 py-3 text-xs leading-relaxed text-white/90 backdrop-blur-sm">
          {aiReply}
        </p>
      )}
    </div>
  );
}
