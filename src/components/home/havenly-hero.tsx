import { Link } from "@tanstack/react-router";
import { HavenlySearch } from "@/components/home/havenly-search";
import { AiSearchField } from "@/components/ai-search-field";
import { PublicHeader, type HomeTab } from "@/components/public-header";
import { Typewriter } from "@/components/typewriter";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HAVENLY_HERO_IMAGE } from "@/lib/constants";

const HERO_PHRASES = [
  "Your Next Investment, Simplified",
  "Find Your Dream Property",
  "Smart Search, Handpicked Listings",
  "Where Location Meets Opportunity",
  "Real Estate Made Easy",
  "Premium Properties, Curated for You",
];

const RENT_PHRASES = [
  "Your Perfect Rental, Found",
  "Quality Rentals, Handpicked",
  "Move In, Live Well",
];

const BUY_PHRASES = [
  "Own Your Piece of Paradise",
  "Invest in Prime Real Estate",
  "Homes Worth Coming Home To",
];

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
  const phrases =
    homeTab === "rent" ? RENT_PHRASES : homeTab === "buy" ? BUY_PHRASES : HERO_PHRASES;

  const subtitle =
    homeTab === "rent"
      ? "Curated rentals vetted for quality and location."
      : homeTab === "buy"
        ? "Handpicked homes ready for you to view."
        : "Explore curated properties — search, filter, and discover.";

  return (
    <div className="p-1.5 sm:p-4 md:p-5 lg:p-6">
      <div className="relative mx-auto flex min-h-[min(78vh,680px)] w-full max-w-[1440px] flex-col overflow-hidden rounded-[20px] sm:min-h-[min(85vh,820px)] sm:rounded-[40px] md:rounded-[48px]">
        <img
          key={heroImage}
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        <PublicHeader variant="overlay" homeTab={homeTab} onHomeTabChange={onHomeTabChange} />

        <div className="relative z-10 mt-auto px-4 pb-4 sm:px-8 sm:pb-6 lg:px-10 lg:pb-8">
          <div className="max-w-2xl">
            <h1 className="min-h-[2.4em] text-2xl font-bold leading-[1.1] tracking-tight text-white sm:min-h-[1.3em] sm:text-5xl md:text-6xl lg:text-[3.5rem]">
              <Typewriter key={homeTab} phrases={phrases} />
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/70 sm:mt-4 sm:text-base">
              {subtitle}
            </p>
          </div>

          <div className="mt-4 space-y-2 sm:mt-6 sm:ml-auto sm:max-w-[720px] sm:space-y-3">
            <AiSearchField variant="hero" />
            <div className="flex items-center justify-end gap-2">
              <Link to="/map">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-11 gap-2 rounded-full border-white/20 bg-black/40 px-4 text-white backdrop-blur hover:bg-black/60"
                >
                  <Map className="h-4 w-4 shrink-0" />
                  View map
                </Button>
              </Link>
            </div>
            <HavenlySearch
              listingType={homeTab === "rent" ? "rent" : homeTab === "buy" ? "sale" : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
