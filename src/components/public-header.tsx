import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type HomeTab = "all" | "buy" | "rent";

const PILLS: {
  id: HomeTab | "map" | "about" | "contact";
  label: string;
  to: string;
  search?: { tab: HomeTab };
}[] = [
  { id: "all", label: "All", to: "/", search: { tab: "all" } },
  { id: "buy", label: "Buy", to: "/", search: { tab: "buy" } },
  { id: "rent", label: "Rent", to: "/", search: { tab: "rent" } },
  { id: "map", label: "Map", to: "/map" },
  { id: "about", label: "About", to: "/about" },
  { id: "contact", label: "Contact", to: "/contact" },
];

type PublicHeaderProps = {
  variant?: "overlay" | "bar";
  homeTab?: HomeTab;
  onHomeTabChange?: (tab: HomeTab) => void;
  className?: string;
};

export function PublicHeader({
  variant = "bar",
  homeTab = "all",
  onHomeTabChange,
  className,
}: PublicHeaderProps) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, loading: authLoading } = useAuth();
  const overlay = variant === "overlay";
  const isHome = pathname === "/";

  function isActive(id: (typeof PILLS)[number]["id"]) {
    if (id === "map") return pathname === "/map";
    if (id === "about") return pathname === "/about";
    if (id === "contact") return pathname === "/contact";
    if (isHome && (id === "all" || id === "buy" || id === "rent")) return homeTab === id;
    return false;
  }

  function pillClass(active: boolean, block = false) {
    return cn(
      block ? "w-full text-left" : "",
      "rounded-full px-4 py-2.5 text-sm font-medium transition-all min-h-[44px] sm:min-h-0 sm:py-2 sm:px-5",
      active
        ? "bg-white text-[#0a0a0a] shadow-sm"
        : overlay
          ? "text-white/90 hover:text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white",
    );
  }

  function renderPill(item: (typeof PILLS)[number], block = false) {
    const active = isActive(item.id);
    const isHomeFilter = item.id === "all" || item.id === "buy" || item.id === "rent";

    if (isHome && isHomeFilter && onHomeTabChange) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onHomeTabChange(item.id as HomeTab)}
          className={pillClass(active, block)}
        >
          {item.label}
        </button>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.to}
        search={item.search}
        onClick={() => setMobileOpen(false)}
        className={pillClass(active, block)}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <>
      <header
        className={cn(
          "relative z-20 flex items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:px-8",
          overlay ? "" : "sticky top-0 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md",
          className,
        )}
      >
        <Link to="/" className="shrink-0 text-lg font-bold tracking-tight text-white sm:text-2xl">
          Offshore<span className="text-[#c6f135]">.</span>
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div
            className={cn(
              "flex max-w-[min(100vw-12rem,42rem)] items-center gap-0.5 overflow-x-auto rounded-full p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              overlay
                ? "bg-white/10 ring-1 ring-white/15 backdrop-blur-md"
                : "bg-[#141414] ring-1 ring-white/10",
            )}
          >
            {PILLS.map((item) => renderPill(item))}
          </div>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/saved" className="hidden sm:inline-flex">
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "gap-1.5 rounded-full text-[11px] uppercase tracking-[0.14em]",
                overlay ? "text-white/90 hover:bg-white/10" : "text-white/80 hover:bg-white/10",
              )}
            >
              <Bookmark className="h-4 w-4" />
              Saved
            </Button>
          </Link>
          <Link to="/properties" className="hidden min-[400px]:inline-flex">
            <Button
              size="sm"
              className="rounded-full bg-[#c6f135] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#d4ff4a] sm:px-5 sm:text-[11px]"
            >
              Browse
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 shrink-0 rounded-full text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,24rem)] border-white/10 bg-[#141414] text-white">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {PILLS.map((item) => renderPill(item, true))}
                <div className="my-2 border-t border-white/10" />
                <Link
                  to="/saved"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-3 text-white/90 hover:bg-white/10"
                >
                  <Bookmark className="h-4 w-4" />
                  Saved
                </Link>
                <Link
                  to="/properties"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-full bg-[#c6f135] px-4 py-3 text-sm font-semibold text-[#0a0a0a]"
                >
                  Browse collection
                </Link>
                {!authLoading &&
                  (user ? (
                    <Button
                      variant="ghost"
                      className="min-h-[44px] justify-start text-white/90"
                      onClick={() => {
                        supabase.auth.signOut();
                        setMobileOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="min-h-[44px] justify-start text-white/90"
                      onClick={() => {
                        setAuthMode("login");
                        setAuthOpen(true);
                        setMobileOpen(false);
                      }}
                    >
                      Account
                    </Button>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden items-center gap-2 lg:flex">
            {!authLoading &&
              (user ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className={cn("rounded-full text-xs", overlay ? "text-white/90" : "text-white/80")}
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign out
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "rounded-full text-[11px] uppercase tracking-[0.14em]",
                    overlay ? "text-white/90" : "text-white/80",
                  )}
                  onClick={() => {
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                >
                  Account
                </Button>
              ))}
          </div>
        </div>
      </header>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={authMode} onModeChange={setAuthMode} />
    </>
  );
}
