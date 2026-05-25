import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { BRAND } from "@/lib/constants";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-white">
      <p className="text-xs uppercase tracking-[0.28em] text-[#c6f135]">404</p>
      <h1 className="mt-4 text-5xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-sm text-center text-sm text-white/50">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-[#c6f135] px-8 text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#d4ff4a]"
      >
        Return home
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-white">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-center text-sm text-white/50">
        We couldn&apos;t load this page. Please try again or return to the homepage.
      </p>
      {error?.message && (
        <p className="mt-4 max-w-md rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-white/60">
          {error.message}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="inline-flex h-11 items-center rounded-full bg-[#c6f135] px-6 text-xs font-semibold uppercase tracking-wider text-[#0a0a0a]"
        >
          Try again
        </button>
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-xs uppercase tracking-wider text-white"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: BRAND.name },
      { name: "description", content: BRAND.tagline },
      { property: "og:title", content: BRAND.name },
      { property: "og:description", content: BRAND.tagline },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
