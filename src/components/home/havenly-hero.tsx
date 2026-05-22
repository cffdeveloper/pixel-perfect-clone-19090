import { Link } from "@tanstack/react-router";
import { HavenlySearch } from "@/components/home/havenly-search";
import { AiAssistant } from "@/components/ai-assistant";
import { PublicHeader, type HomeTab } from "@/components/public-header";
import { Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HAVENLY_HERO_IMAGE } from "@/lib/constants";

type HavenlyHeroProps = {
  homeTab: HomeTab;
  onHomeTabChange: (tab: HomeTab) => void;
  heroImage?: string;
};

export function HavenlyHero({
  homeTab,
  onHomeTabChange,
  heroImage = HAVENLY_HERO_IMAGE,
}: HavenlyHeroProps) {
  return (
    <div className="p-2 sm:p-4 md:p-5 lg:p-6">
      <div className="relative mx-auto flex min-h-[min(72vh,720px)] w-full max-w-[1440px] flex-col overflow-hidden rounded-[24px] sm:min-h-[min(85vh,820px)] sm:rounded-[40px] md:rounded-[48px]">
        <img
          key={heroImage}
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        <PublicHeader variant="overlay" homeTab={homeTab} onHomeTabChange={onHomeTabChange} />

        <div className="relative z-10 mt-auto flex flex-1 flex-col justify-end px-4 pb-[280px] pt-4 sm:px-8 sm:pb-44 sm:pt-0 lg:px-10 lg:pb-48">
          <div className="max-w-2xl">
            <h1 className="text-[1.75rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem]">
              {homeTab === "rent"
                ? "Find Your Next Rental"
                : homeTab === "buy"
                  ? "Homes for Sale"
                  : "Real Estate Made Easy & Transparent"}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
              {homeTab === "rent"
                ? "Browse published rentals below."
                : homeTab === "buy"
                  ? "Browse homes for sale below."
                  : "All published listings — filter with the tabs below."}
            </p>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-20 space-y-2.5 sm:bottom-8 sm:left-auto sm:right-8 sm:max-w-[720px] sm:space-y-3 lg:bottom-10 lg:right-10">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link to="/map" className="min-w-0 flex-1 sm:flex-none">
              <Button
                variant="secondary"
                size="sm"
                className="h-11 w-full gap-2 rounded-full border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/60 sm:w-auto"
              >
                <Map className="h-4 w-4 shrink-0" />
                <span className="truncate">View map</span>
              </Button>
            </Link>
            <AiAssistant
              trigger={
                <Button
                  size="sm"
                  className="h-11 w-full gap-2 rounded-full bg-[#c6f135] text-[#0a0a0a] hover:bg-[#d4ff4a] sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="truncate">AI assistant</span>
                </Button>
              }
            />
          </div>
          <HavenlySearch
            listingType={homeTab === "rent" ? "rent" : homeTab === "buy" ? "sale" : undefined}
          />
        </div>
      </div>
    </div>
  );
}
