import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
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

for (const name of [
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
]) {
  const v = env[name];
  if (!v) {
    console.log(name, 'MISSING');
    continue;
  }
  const parts = v.split('.');
  let payload = {};
  try {
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  } catch (e) {
    console.log(name, 'INVALID_JWT', parts.length, 'parts', 'len', v.length);
    continue;
  }
  console.log(name, 'len', v.length, 'role', payload.role, 'ref', payload.ref);
}

console.log('SUPABASE_URL', env.SUPABASE_URL);
