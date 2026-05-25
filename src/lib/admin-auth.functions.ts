import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";
import { rateLimit } from "@/lib/rate-limit";

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    rateLimit("admin-login", 5, 60_000);

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      throw new Error("ADMIN_PASSWORD is not set on the server");
    }

    const bufA = Buffer.from(data.password);
    const bufB = Buffer.from(expected);
    const match =
      bufA.length === bufB.length && timingSafeEqual(bufA, bufB);

    if (!match) {
      throw new Error("Invalid password");
    }
    return { ok: true as const };
  });
