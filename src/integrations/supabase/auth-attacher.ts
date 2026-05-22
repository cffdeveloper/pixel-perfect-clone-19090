import { createMiddleware } from "@tanstack/react-start";
import { getAdminBearerToken } from "@/lib/admin-session";
import { supabase } from "./client";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const adminToken = getAdminBearerToken();
    if (adminToken) {
      return next({ headers: { Authorization: `Bearer ${adminToken}` } });
    }
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
