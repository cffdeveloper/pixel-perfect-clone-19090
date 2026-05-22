import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/properties.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EnquiryForm({
  propertyId,
  source = "enquiry",
}: {
  propertyId?: string;
  source?: "enquiry" | "contact";
}) {
  const submit = useServerFn(createLead);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submit({
        data: {
          client_name: String(fd.get("name")),
          client_email: String(fd.get("email")),
          client_phone: (fd.get("phone") as string) || null,
          message: (fd.get("message") as string) || null,
          source,
          property_id: propertyId ?? null,
        },
      });
      toast.success("Thank you — an advisor will be in touch shortly.");
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send enquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required maxLength={200} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required maxLength={320} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" maxLength={40} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={4} maxLength={5000} placeholder="Tell us what you're looking for…" />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#c6f135] font-semibold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#d4ff4a]"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send enquiry
      </Button>
    </form>
  );
}
