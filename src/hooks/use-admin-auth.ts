import { useEffect, useState } from "react";
import { isAdminSessionActive } from "@/lib/admin-session";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAdmin(isAdminSessionActive());
    setLoading(false);

    const onStorage = () => setIsAdmin(isAdminSessionActive());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { isAdmin, loading, user: isAdmin ? { email: "admin" } : null };
}
