import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      throw new Error("ADMIN_PASSWORD is not set on the server");
    }
    if (data.password !== expected) {
      throw new Error("Invalid password");
    }
    return { ok: true as const };
  });
