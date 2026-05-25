import { LISTING_TYPES, PROPERTY_TYPES } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type PropertySearch = {
  q?: string;
  propertyType?: string;
  listingType?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
};

export function PropertyFilters({
  values,
  onChange,
  onReset,
}: {
  values: PropertySearch;
  onChange: (patch: Partial<PropertySearch>) => void;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#141414] p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-4 xl:grid-cols-6">
      <div className="space-y-1.5 sm:col-span-2">
        <Label className="text-xs uppercase tracking-wider text-white/50">Search</Label>
        <Input
          placeholder="Title, city, keywords…"
          value={values.q ?? ""}
          onChange={(e) => onChange({ q: e.target.value })}
          className="border-white/10 bg-[#0a0a0a] text-white placeholder:text-white/35"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-white/50">Type</Label>
        <Select value={values.propertyType ?? "any"} onValueChange={(v) => onChange({ propertyType: v })}>
          <SelectTrigger className="border-white/10 bg-[#0a0a0a] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-white/50">Listing</Label>
        <Select value={values.listingType ?? "any"} onValueChange={(v) => onChange({ listingType: v })}>
          <SelectTrigger className="border-white/10 bg-[#0a0a0a] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LISTING_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-white/50">City</Label>
        <Input
          placeholder="Any city"
          value={values.city ?? ""}
          onChange={(e) => onChange({ city: e.target.value })}
          className="border-white/10 bg-[#0a0a0a] text-white placeholder:text-white/35"
        />
      </div>
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-full border-white/15 text-white hover:bg-white/10"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
