import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-deep text-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl">Offshore<span className="text-brass">.</span></div>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Curated coastal properties for those who value perspective.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li><Link to="/properties" className="hover:text-brass">All listings</Link></li>
            <li><Link to="/properties" search={{ propertyType: "villa" }} className="hover:text-brass">Villas</Link></li>
            <li><Link to="/properties" search={{ propertyType: "apartment" }} className="hover:text-brass">Apartments</Link></li>
            <li><Link to="/properties" search={{ propertyType: "land" }} className="hover:text-brass">Land</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li><Link to="/about" className="hover:text-brass">About</Link></li>
            <li><Link to="/contact" className="hover:text-brass">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-brass">Agent login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li>hello@offshoreproperties.com</li>
            <li>+1 (555) 010-0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-background/50">
          <span>© {new Date().getFullYear()} Offshore Properties. All rights reserved.</span>
          <span>Curated coastal real estate</span>
        </div>
      </div>
    </footer>
  );
}