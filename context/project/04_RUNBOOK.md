# 04 Runbook

## Prerequisites

| Dependency | Version | Check |
|---|---|---|
| Node.js | 20+ | `node -v` |
| npm _or_ pnpm | latest | `npm -v` / `pnpm -v` |
| Supabase CLI | latest | `supabase --version` |
| Git | latest | `git --version` |
| Mintlify CLI | latest | `mint --version` |

## Initial Setup (app branch)

```bash
npm install
cp .env.local.example .env.local
npm run local:up
```

## Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=generated-by-local-setup
SUPABASE_SERVICE_ROLE_KEY=generated-by-local-setup
SUPABASE_SERVER_URL=http://host.docker.internal:54321
SUPABASE_PRODUCTION_DB_URL=postgresql://postgres.your-project-ref:your-db-password@db.your-project-ref.supabase.co:5432/postgres
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=optional-for-local
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=optional-for-local
```

## Development Server

```bash
npm run local:up
```

## Useful Scripts (app branch)

| Command | Purpose |
|---|---|
| `npm run local:setup` | Start local Supabase, write `.env.local`, and regenerate Supabase types |
| `npm run local:up` | Start local Supabase and the app container so both appear in Docker Desktop |
| `npm run local:down` | Stop the app container and the local Supabase stack |
| `npm run dev` | Start dev server directly on the host instead of in Docker |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run test` | Run tests |
| `npm run qa` | Full QA gate |
| `npm run db:start` | Start local Supabase in Docker through Supabase CLI |
| `npm run db:status` | Show local Supabase status |
| `npm run db:env:local` | Write local Supabase URL and keys into `.env.local` |
| `npm run db:reset` | Reset the local database from migrations |
| `npm run db:sync:prod-to-local` | Reset local DB and copy production data into it |
| `npm run db:types` | Regenerate Supabase TS types |

## Local Database Flow

Shortest path:

```bash
npm install
cp .env.local.example .env.local
npm run local:up
```

Step-by-step path:

```bash
npm run local:setup
docker compose -f compose.local.yml up -d --build app
```

Host-only app path:

```bash
npm run db:start
npm run db:env:local
npm run db:types
npm run dev
```

Sync production data into local:

```bash
npm run db:sync:prod-to-local
```

This command expects:

- `SUPABASE_PRODUCTION_DB_URL`
- `pg_dump`
- `psql`

It copies:

- all `public` tables
- `auth.users`
- `auth.identities`

It does not copy:

- active sessions
- refresh tokens

## Local Database Clients

To connect with TablePlus or any PostgreSQL client:

- Host: `127.0.0.1`
- Port: `54322`
- User: `postgres`
- Password: `postgres`
- Database: `postgres`
- SSL: disabled

Connection URL:

```bash
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Docs Branch Workflow (`docs`)

The `docs` branch is a separate Mintlify branch.

### Create it once

```bash
git switch --orphan docs
git rm -rf .
# add Mintlify docs files at branch root
```

### Update docs later

```bash
git switch docs
# edit docs.json and .mdx pages
```

### Return to app work

```bash
git switch main
```

## Mintlify Local Development (`docs` branch)

Mintlify requires a `docs.json` file at the docs root, navigation entries must point to page paths explicitly, and local preview runs from the directory containing `docs.json`. Use the CLI to preview locally and validate docs before publishing. The official CLI install command is `npm i -g mint`, and local preview runs with `mint dev`. citeturn550955search0turn315145view1turn315145view0

```bash
npm i -g mint
git switch docs
mint dev
```

Useful docs commands:

```bash
mint dev --no-open
mint dev --port 3333
mint broken-links
```

## Quality Gate Pipeline (app branch)

Run in strict order:

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

Prefer `npm run qa` when it exists.

## Delivery Report (required)

```txt
## Delivery Report

Summary: one-line description

Files touched:
- src/... or context/...
- README.md
- docs branch: docs.json, index.mdx

Pipeline executed:
1. npm run lint
2. npx tsc --noEmit
3. npm run test
4. npm run build

Docs branch updated:
- yes / no
- branch: docs

Blockers / deviations:
- none or explicit explanation
```
