import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const requireAdminAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error("Admin access is not configured (ADMIN_PASSWORD missing).");
    }

    const request = getRequest();
    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Admin login required");
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== adminPassword) {
      throw new Error("Unauthorized: Invalid admin credentials");
    }

    return next();
  },
);
