/**
 * Push supabase/migrations to the remote database.
 *
 * Set SUPABASE_DB_URL in .env (Dashboard → Connect → Session pooler URI).
 * Or link the project: npx supabase login && npx supabase link --project-ref <ref>
 * then run: npm run db:push:linked
 */
import { readFileSync, existsSync } from 'fs';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const path = join(root, '.env');
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=');
        const k = l.slice(0, i);
        let v = l.slice(i + 1).trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        return [k, v];
      }),
  );
}

const env = loadEnv();
const dbUrl = process.env.SUPABASE_DB_URL || env.SUPABASE_DB_URL;
const useLinked = process.argv.includes('--linked');

const args = ['supabase', 'db', 'push', '--yes'];
if (useLinked) {
  args.push('--linked');
} else if (dbUrl) {
  args.push('--db-url', dbUrl);
} else {
  console.error(`
Missing database connection.

Add to .env (from Supabase Dashboard → Connect → Session pooler):
  SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<password>@...

Then run:
  npm run db:push

Or log in with the account that owns the project and run:
  npx supabase login
  npx supabase link --project-ref ${env.VITE_SUPABASE_PROJECT_ID || 'gdoalzqtopkjttvktnhj'}
  npm run db:push:linked
`);
  process.exit(1);
}

console.log(useLinked ? 'Pushing migrations (linked project)...' : 'Pushing migrations (SUPABASE_DB_URL)...');

const result = spawnSync('npx', args, {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
