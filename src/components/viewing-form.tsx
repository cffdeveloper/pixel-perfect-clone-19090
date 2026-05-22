import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createBooking } from "@/lib/properties.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ViewingForm({ propertyId }: { propertyId: string }) {
  const submit = useServerFn(createBooking);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = String(fd.get("date"));
    const time = String(fd.get("time"));
    const requested = new Date(`${date}T${time}`);
    if (requested.getTime() <= Date.now()) {
      toast.error("Please choose a future date and time.");
      return;
    }
    setLoading(true);
    try {
      await submit({
        data: {
          client_name: String(fd.get("name")),
          client_email: String(fd.get("email")),
          client_phone: (fd.get("phone") as string) || null,
          property_id: propertyId,
          requested_at: requested.toISOString(),
          notes: (fd.get("notes") as string) || null,
        },
      });
      toast.success("Viewing request received. We'll confirm by email.");
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not schedule viewing");
    } finally {
      setLoading(false);
    }
  }

  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="v-name">Name</Label>
          <Input id="v-name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="v-email">Email</Label>
          <Input id="v-email" name="email" type="email" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="v-phone">Phone</Label>
        <Input id="v-phone" name="phone" type="tel" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="date">Preferred date</Label>
          <Input id="date" name="date" type="date" required min={minDate} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" type="time" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Accessibility, party size, etc." />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#c6f135] font-semibold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#d4ff4a]"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Request viewing
      </Button>
    </form>
  );
}
