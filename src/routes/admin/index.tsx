import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminStats } from "@/lib/properties.functions";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { SectionHeading } from "@/components/section-heading";
import { Building2, Inbox, Calendar, Eye } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: `Dashboard — ${BRAND.name}` }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const fetchStats = useServerFn(adminStats);
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchStats(),
    enabled: isAdmin,
  });

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/adminlogin" });
  }, [loading, isAdmin, navigate]);

  const published = stats?.properties.filter((p) => p.is_published).length ?? 0;
  const drafts = (stats?.properties.length ?? 0) - published;
  const newLeads = stats?.leads.filter((l) => l.status === "new").length ?? 0;
  const pendingBookings = stats?.bookings.filter((b) => b.status === "pending").length ?? 0;

  const cards = [
    { label: "Published listings", value: published, icon: Building2, to: "/admin/properties" },
    { label: "Draft listings", value: drafts, icon: Building2, to: "/admin/properties" },
    { label: "New leads", value: newLeads, icon: Inbox, to: "/admin/leads" },
    { label: "Pending viewings", value: pendingBookings, icon: Calendar, to: "/admin/bookings" },
    { label: "Views (30 days)", value: stats?.recentViews.length ?? 0, icon: Eye, to: "/admin/properties" },
  ];

  return (
    <div>
      <SectionHeading eyebrow="Dashboard" title="Overview" description="Manage listings, enquiries, and viewing requests." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-xl border border-border bg-card p-5 shadow-card transition-smooth hover:shadow-elevated"
          >
            <c.icon className="h-5 w-5 text-brass" />
            <p className="mt-4 font-display text-3xl text-foreground">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
