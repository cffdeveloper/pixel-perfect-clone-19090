const ADMIN_SESSION_KEY = "offshore_admin_session";

export function isAdminSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function setAdminSessionActive(): void {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem("offshore_admin_token");
}

export function getAdminBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("offshore_admin_token");
}

export function setAdminBearerToken(token: string): void {
  sessionStorage.setItem("offshore_admin_token", token);
  setAdminSessionActive();
}
