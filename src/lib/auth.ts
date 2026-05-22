/** OAuth / magic-link redirect target — must match Supabase Dashboard → Auth → URL Configuration */
export function getAuthCallbackUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  const site =
    import.meta.env.VITE_SITE_URL ||
    process.env.VITE_SITE_URL ||
    "http://localhost:8080";
  return `${site.replace(/\/$/, "")}/auth/callback`;
}

export function getPasswordResetRedirectUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/reset-password`;
  }
  const site =
    import.meta.env.VITE_SITE_URL ||
    process.env.VITE_SITE_URL ||
    "http://localhost:8080";
  return `${site.replace(/\/$/, "")}/auth/reset-password`;
}

export function storeAuthReturnPath() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname + window.location.search;
  if (!path.startsWith("/auth/")) {
    sessionStorage.setItem("auth_return_to", path);
  }
}

export function consumeAuthReturnPath(): string {
  if (typeof window === "undefined") return "/";
  const path = sessionStorage.getItem("auth_return_to") || "/";
  sessionStorage.removeItem("auth_return_to");
  return path.startsWith("/") ? path : "/";
}
