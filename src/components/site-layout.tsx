import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export function SiteLayout({
  children,
  className = "",
  showFooter = true,
}: {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
}) {
  return (
    <div className={`flex min-h-screen flex-col overflow-x-hidden bg-[#c8c8c8] ${className}`}>
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden rounded-none bg-[#0a0a0a] sm:m-3 sm:rounded-[32px] md:m-4 md:rounded-[40px] lg:m-5 lg:rounded-[48px]">
        <SiteHeader />
        <main className="flex-1 overflow-x-hidden text-white">{children}</main>
        {showFooter && <SiteFooter />}
      </div>
    </div>
  );
}
