import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdminAuth } from "@/integrations/supabase/admin-middleware";

export const uploadPropertyImage = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        fileName: z.string().min(1).max(200),
        contentType: z.string().min(3).max(100),
        dataBase64: z.string().min(1).max(15_000_000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const ext = data.fileName.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const path = `${Date.now()}-${safeName}.${ext}`;

    const buffer = Buffer.from(data.dataBase64, "base64");
    const { error } = await supabaseAdmin.storage
      .from("property-images")
      .upload(path, buffer, {
        contentType: data.contentType,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabaseAdmin.storage.from("property-images").getPublicUrl(path);
    return { url: urlData.publicUrl, path };
  });
