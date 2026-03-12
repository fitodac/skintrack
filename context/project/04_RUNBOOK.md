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
supabase start
supabase db push
npm run db:types
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Development Server

```bash
npm run dev
supabase start
```

## Useful Scripts (app branch)

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run test` | Run tests |
| `npm run qa` | Full QA gate |
| `npm run db:types` | Regenerate Supabase TS types |

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
