import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#141414] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-16 md:grid-cols-4">
        <div>
          <div className="text-2xl font-bold">
            Offshore<span className="text-[#c6f135]">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
            Real estate made easy and transparent — curated listings across the coast.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Explore</h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link to="/properties" className="inline-flex min-h-[44px] items-center text-white/55 hover:text-[#c6f135]">
                All listings
              </Link>
            </li>
            <li>
              <Link to="/map" className="inline-flex min-h-[44px] items-center text-white/55 hover:text-[#c6f135]">
                Property map
              </Link>
            </li>
            <li>
              <Link to="/properties" search={{ propertyType: "villa" }} className="inline-flex min-h-[44px] items-center text-white/55 hover:text-[#c6f135]">
                Villas
              </Link>
            </li>
            <li>
              <Link to="/properties" search={{ listingType: "rent" }} className="inline-flex min-h-[44px] items-center text-white/55 hover:text-[#c6f135]">
                For rent
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Company</h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link to="/about" className="inline-flex min-h-[44px] items-center text-white/55 hover:text-[#c6f135]">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="inline-flex min-h-[44px] items-center text-white/55 hover:text-[#c6f135]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <a href="mailto:hello@offshoreproperties.com" className="inline-flex min-h-[44px] items-center text-white/55 hover:text-[#c6f135]">
                hello@offshoreproperties.com
              </a>
            </li>
            <li className="inline-flex min-h-[44px] items-center text-white/55">
              +1 (555) 010-0000
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:px-6">
          <span>© {new Date().getFullYear()} Offshore Properties</span>
          <span>Black · White · Green</span>
        </div>
      </div>
    </footer>
  );
}
