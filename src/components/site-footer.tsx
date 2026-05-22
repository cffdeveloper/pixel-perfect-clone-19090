import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#141414] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-16 md:grid-cols-4">
        <div>
          <div className="text-2xl font-bold">
            Offshore<span className="text-[#c6f135]">.</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/55">
            Real estate made easy and transparent — curated listings across the coast.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/55">
            <li>
              <Link to="/properties" className="hover:text-[#c6f135]">
                All listings
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-[#c6f135]">
                Property map
              </Link>
            </li>
            <li>
              <Link to="/properties" search={{ propertyType: "villa" }} className="hover:text-[#c6f135]">
                Villas
              </Link>
            </li>
            <li>
              <Link to="/properties" search={{ listingType: "rent" }} className="hover:text-[#c6f135]">
                For rent
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/55">
            <li>
              <Link to="/about" className="hover:text-[#c6f135]">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#c6f135]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/55">
            <li>hello@offshoreproperties.com</li>
            <li>+1 (555) 010-0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Offshore Properties</span>
          <span>Black · White · Green</span>
        </div>
      </div>
    </footer>
  );
}
