# SkinTrack

SkinTrack is a small production app for cosmetology practices that need:

- private staff authentication
- patient records with strict ownership
- clinical session drafts with autosave
- superadmin user management

The app is built with Next.js 15, Supabase Auth, PostgreSQL + RLS, Tailwind 4, Motion,
Zod, Zustand, and Vitest.

## Current scope

This repository now includes:

- App Router setup with protected `(app)` and public `(auth)` route groups
- Supabase SSR clients for server, browser, admin, and middleware usage
- initial SQL migration for:
  - `profiles`
  - `user_invitations`
  - `patients`
  - `clinical_sessions`
  - helper functions and RLS policies
- profile management
- patient listing, search, creation, update, and detail tabs
- clinical session draft creation, autosave, and completion
- superadmin invitation flow and user administration
- session expiry warning UI
- unit tests for schemas, helpers, mappers, and Zustand session warning state

## Routes

- `/login`
- `/auth/callback`
- `/profile`
- `/patients`
- `/patients/[patientId]`
- `/patients/[patientId]/sessions/new`
- `/patients/[patientId]/sessions/[sessionId]`
- `/admin/users`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.local.example .env.local
```

3. Fill these values before starting local Supabase:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret
SUPABASE_PRODUCTION_DB_URL=postgresql://postgres.your-project-ref:your-db-password@db.your-project-ref.supabase.co:5432/postgres
```

4. Start the local Supabase stack in Docker:

```bash
npm run db:start
```

5. Write the local Supabase URL and keys into `.env.local`:

```bash
npm run db:env:local
```

6. Regenerate the checked-in database types from the local stack:

```bash
npm run db:types
```

7. Run the app:

```bash
npm run dev
```

Useful local database commands:

```bash
npm run db:status
npm run db:reset
npm run db:stop
```

## Production to local sync

To replace all local data with a fresh copy from production:

```bash
npm run db:sync:prod-to-local
```

What this command does:

- starts the local Supabase stack if it is not running
- resets the local database from `supabase/migrations`
- dumps all `public` tables from production
- also dumps `auth.users` and `auth.identities`
- restores that data into the local Supabase database

Requirements:

- `SUPABASE_PRODUCTION_DB_URL` must exist in your shell or `.env.local`
- `pg_dump` and `psql` must be installed locally

The sync intentionally does **not** copy active sessions or refresh tokens from production.

## Supabase config

The repo now includes:

```txt
supabase/config.toml
supabase/migrations/20260312180000_init_skintrack.sql
```

This local config keeps auth private like production:

- public signup disabled
- email/password login enabled for invited users
- Google OAuth enabled through environment variables
- local callback allowed at `http://localhost:3000/auth/callback`

## Auth and onboarding

- Public signup must stay disabled.
- Users are invited by a `superadmin`.
- Email/password and Google OAuth are both supported.
- Google access is still restricted to invited emails because onboarding depends on
  `user_invitations`.
- On first successful login, `complete_user_onboarding()` creates or syncs the
  `profiles` row.

### First environment bootstrap

The migration cannot invent real emails for the initial `master` and `sandra` users.
Use real addresses in your environment and bootstrap them before the first login.

Recommended flow:

1. create the initial auth users in Supabase Auth
2. insert matching invitation rows with the real emails
3. let each user complete first login so `profiles` is created safely

For local development with Google OAuth, configure the Google client to allow:

- `http://127.0.0.1:54321/auth/v1/callback`
- `http://localhost:3000/auth/callback`

## Quality commands

Run the full gate in this order:

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

Or use:

```bash
npm run qa
```

## Notes

- `src/middleware.ts` is required for session refresh and protected routing.
- `service_role` is used only in server-side invitation flows.
- `src/types/supabase.ts` is a checked-in schema snapshot for this implementation and
  should be regenerated from a real project once Supabase CLI is linked.
