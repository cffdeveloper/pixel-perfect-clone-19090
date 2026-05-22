import { cn } from "@/lib/utils";
import type { HomeTab } from "@/components/public-header";

const TABS: { id: HomeTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
];

export function HomeTabStrip({
  active,
  onChange,
}: {
  active: HomeTab;
  onChange: (tab: HomeTab) => void;
}) {
  return (
    <div className="px-3 pt-3 md:hidden">
      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Listing type"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition min-h-[44px]",
              active === tab.id
                ? "bg-[#c6f135] text-[#0a0a0a]"
                : "bg-[#141414] text-white/80 ring-1 ring-white/10",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
