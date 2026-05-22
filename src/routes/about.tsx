import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "@/components/section-heading";
import { BRAND, HAVENLY_HERO_SALE } from "@/lib/constants";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${BRAND.name}` },
      { name: "description", content: "Our philosophy of curated coastal real estate." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative mx-3 overflow-hidden rounded-[32px] sm:mx-4 md:mx-5 lg:mx-6">
        <div className="relative flex min-h-[40vh] items-end">
          <img src={HAVENLY_HERO_SALE} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/20" />
          <div className="relative w-full px-6 pb-12 pt-24 sm:px-10 sm:pb-16">
            <SectionHeading
              eyebrow="Our story"
              title="Perspective over volume"
              description="Offshore Properties was founded on a simple belief: the finest coastal homes are discovered, not scrolled past."
            />
          </div>
        </div>
      </section>

      <section className="page-panel mt-6">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-white/60">
          <p>
            We represent a deliberately small portfolio of villas, apartments, and land along the
            world&apos;s most desirable coastlines. Each instruction is handled with discretion —
            from first enquiry through completion.
          </p>
          <p>
            Our advisors combine local market knowledge with an international buyer network. Whether
            you are acquiring a primary residence, a rental investment, or a short-let retreat, we
            guide you with clarity and without pressure.
          </p>
        </div>
        <Link
          to="/contact"
          className="mt-10 inline-flex h-11 items-center rounded-full bg-[#c6f135] px-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] transition hover:bg-[#d4ff4a]"
        >
          Speak with us
        </Link>
      </section>
    </SiteLayout>
  );
}
