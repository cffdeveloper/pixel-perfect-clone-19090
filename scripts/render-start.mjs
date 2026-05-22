/**
 * Render Web Service entrypoint.
 * TanStack Start + Cloudflare plugin outputs dist/server (Worker + static assets).
 * Wrangler serves the built worker on Render's PORT.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = path.join(root, "dist", "server", "wrangler.json");
const port = process.env.PORT ?? "10000";

if (!existsSync(config)) {
  console.error(
    `[render-start] Missing ${config}. Run "npm run build" before starting.`,
  );
  process.exit(1);
}

const wranglerJs = path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");
if (!existsSync(wranglerJs)) {
  console.error("[render-start] wrangler not installed. Run npm install.");
  process.exit(1);
}

console.log(`[render-start] Listening on 0.0.0.0:${port}`);

const child = spawn(
  process.execPath,
  [
    wranglerJs,
    "dev",
    "--config",
    config,
    "--local",
    "--ip",
    "0.0.0.0",
    "--port",
    port,
    "--local-protocol",
    "http",
  ],
  { stdio: "inherit", env: process.env, cwd: root },
);

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});

process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
