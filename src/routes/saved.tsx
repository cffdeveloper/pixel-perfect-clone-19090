import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { PropertyCard } from "@/components/property-card";
import { listSavedProperties } from "@/lib/social.functions";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: `Saved — ${BRAND.name}` }] }),
  component: SavedPage,
});

function SavedPage() {
  const { user, loading } = useAuth();
  const fetch = useServerFn(listSavedProperties);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["saved-properties"],
    queryFn: () => fetch(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) setAuthOpen(true);
  }, [loading, user]);

  return (
    <SiteLayout>
      <section className="page-panel">
        <h1 className="text-3xl font-bold tracking-tight text-white">Saved properties</h1>
        <p className="mt-2 text-white/50">Your shortlist across all devices when signed in.</p>
        {!user && !loading && (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <p className="text-lg font-medium text-white">Sign in to see saved listings</p>
            <Button
              className="mt-4 rounded-full bg-[#c6f135] text-[#0a0a0a] hover:bg-[#d4ff4a]"
              onClick={() => setAuthOpen(true)}
            >
              Create account
            </Button>
          </div>
        )}
        {user && isLoading && <div className="mt-10 h-48 animate-pulse rounded-xl bg-white/5" />}
        {user && !isLoading && properties.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 p-12 text-center text-white/50">
            No saved properties yet. Browse the{" "}
            <Link to="/properties" className="text-[#c6f135] underline">
              collection
            </Link>{" "}
            and tap Save.
          </div>
        )}
        {user && properties.length > 0 && (
          <div className="mt-8 grid gap-3 lg:grid-cols-2">
            {properties.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={authMode} onModeChange={setAuthMode} />
    </SiteLayout>
  );
}
