import { BRAND } from "@/lib/constants";

/**
 * Strips everything except digits and a leading '+' so we get a clean
 * international number for the wa.me link.
 */
function cleanNumber(raw: string): string {
  const stripped = raw.replace(/[^+\d]/g, "");
  return stripped.startsWith("+") ? stripped.slice(1) : stripped;
}

/**
 * Build a WhatsApp click-to-chat URL.
 * Falls back to BRAND.whatsapp if no agent number is provided.
 * `lines` is an array of message lines — nulls are filtered out.
 */
export function buildWhatsAppUrl(
  agentNumber: string | null | undefined,
  lines: (string | null | undefined)[],
): string {
  const number = cleanNumber(agentNumber || BRAND.whatsapp);
  const text = lines.filter((l): l is string => l != null).join("\n");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
