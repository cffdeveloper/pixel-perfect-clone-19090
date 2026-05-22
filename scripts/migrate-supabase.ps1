# Migrate schema + data from one Supabase project to another.
#
# WITHOUT Docker (your setup): use the dashboard path in the message printed by
#   .\scripts\migrate-supabase.ps1 -NewProjectRef "xxx" -SkipData
# and copy data via Dashboard backup (paid) or install Postgres client + psql only.
#
# Prerequisites for full data dump: Node.js, Docker Desktop, psql on PATH.
#
# Usage:
#   1. Create the new project at https://database.new/
#   2. Copy .env.example to .env and fill NEW project API keys (after migration completes)
#   3. Set connection strings (Dashboard → Connect → Session pooler):
#        $env:OLD_DB_URL = "postgresql://postgres.OLD_REF:PASSWORD@..."
#        $env:NEW_DB_URL = "postgresql://postgres.NEW_REF:PASSWORD@..."
#   4. Run: .\scripts\migrate-supabase.ps1 -NewProjectRef "your_new_ref"
#
# What this does:
#   - Dumps roles, schema, and data from the OLD database
#   - Pushes repo migrations to the NEW project (idempotent schema baseline)
#   - Restores data into the NEW database
#   - Updates supabase/config.toml and prompts for .env key updates

param(
  [Parameter(Mandatory = $true)]
  [string]$NewProjectRef,

  [string]$OldProjectRef = "zauyhjhdtglxzsbqzrxe",

  [switch]$SkipData,
  [switch]$SkipSchemaPush
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Require-Env($Name) {
  if (-not (Get-Item "Env:$Name" -ErrorAction SilentlyContinue)) {
    throw "Missing env var $Name. Set it before running this script."
  }
}

Write-Host "=== Supabase migration ===" -ForegroundColor Cyan
Write-Host "Old project: $OldProjectRef"
Write-Host "New project: $NewProjectRef"

if (-not $SkipData) {
  Require-Env "OLD_DB_URL"
  Require-Env "NEW_DB_URL"
}

$dumpDir = Join-Path $Root "supabase\.migration-dump"
New-Item -ItemType Directory -Force -Path $dumpDir | Out-Null

if (-not $SkipData) {
  Write-Host "`n[1/4] Dumping OLD database..." -ForegroundColor Yellow
  npx supabase db dump --db-url $env:OLD_DB_URL -f (Join-Path $dumpDir "roles.sql") --role-only
  npx supabase db dump --db-url $env:OLD_DB_URL -f (Join-Path $dumpDir "schema.sql")
  npx supabase db dump --db-url $env:OLD_DB_URL -f (Join-Path $dumpDir "data.sql") --use-copy --data-only `
    -x "storage.buckets_vectors" -x "storage.vector_indexes"
}

if (-not $SkipSchemaPush) {
  Write-Host "`n[2/4] Linking NEW project and pushing migrations..." -ForegroundColor Yellow
  npx supabase link --project-ref $NewProjectRef
  npx supabase db push
}

if (-not $SkipData) {
  Write-Host "`n[3/4] Restoring data into NEW database..." -ForegroundColor Yellow
  $roles = Join-Path $dumpDir "roles.sql"
  $schema = Join-Path $dumpDir "schema.sql"
  $data = Join-Path $dumpDir "data.sql"
  psql --single-transaction --variable ON_ERROR_STOP=1 `
    --file $roles `
    --file $schema `
    --command "SET session_replication_role = replica" `
    --file $data `
    --dbname $env:NEW_DB_URL
}

Write-Host "`n[4/4] Updating supabase/config.toml..." -ForegroundColor Yellow
$configPath = Join-Path $Root "supabase\config.toml"
(Get-Content $configPath -Raw) -replace 'project_id = ".*"', "project_id = `"$NewProjectRef`"" | Set-Content $configPath -NoNewline

if ($SkipData) {
  Write-Host @"

No-Docker schema path:
  1. New project → SQL Editor → run each file in supabase/migrations/ (oldest timestamp first).
  2. Or: npx supabase login → npx supabase link --project-ref $NewProjectRef → npx supabase db push
  3. Data: OLD project → Database → Backups → download, then restore on NEW (paid),
     or install PostgreSQL for Windows and use psql with scripts/migrate-supabase.ps1 without -SkipData.

"@ -ForegroundColor Yellow
}

Write-Host @"

Done (database). Manual steps still required:

1. Dashboard → NEW project → Settings → API:
   - Copy Project URL, anon key, service_role key into .env and VITE_* vars.

2. Storage: copy files from OLD 'property-images' bucket to NEW (Dashboard or CLI).
   Image URLs in properties.images / hero_image must point at the new project if paths changed.

3. Auth: users are in auth.users. If dump/restore did not include them, re-invite admins
   (binfred.ke@gmail.com gets admin via migration trigger on signup).

4. Restart dev server after updating .env.

"@ -ForegroundColor Green
