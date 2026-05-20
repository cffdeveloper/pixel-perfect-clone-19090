import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onLight = pathname !== "/";
  return (
    <header
      className={
        "absolute left-0 right-0 top-0 z-30 " +
        (onLight ? "bg-background/95 backdrop-blur border-b" : "bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className={"font-display text-2xl tracking-tight " + (onLight ? "text-foreground" : "text-background")}>
          Offshore<span className="text-brass">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={
                "text-sm tracking-wide uppercase transition-smooth " +
                (onLight ? "text-foreground/80 hover:text-brass" : "text-background/90 hover:text-brass")
              }
              activeProps={{ className: "text-brass" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/properties"
            className="rounded-sm border border-brass bg-brass px-5 py-2.5 text-sm font-medium tracking-wide uppercase text-primary-foreground transition-smooth hover:bg-transparent hover:text-brass"
          >
            Browse Listings
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className={"md:hidden " + (onLight ? "text-foreground" : "text-background")}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-foreground/80"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}