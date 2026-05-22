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

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

for (const t of ['agents', 'properties', 'leads', 'bookings', 'user_roles']) {
  const r = await fetch(`${url}/rest/v1/${t}?select=id`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  const extra = r.ok ? '' : (await r.text()).slice(0, 120);
  console.log(t, r.status, r.headers.get('content-range') || extra);
}

const buckets = await fetch(`${url}/storage/v1/bucket`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
console.log('buckets', buckets.status, (await buckets.text()).slice(0, 300));
