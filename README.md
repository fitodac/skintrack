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

3. Fill these values:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Apply the SQL migration in Supabase.

The repo includes:

```txt
supabase/migrations/20260312180000_init_skintrack.sql
```

If you use Supabase CLI, push migrations and then regenerate database types:

```bash
supabase db push
npm run db:types
```

The CLI is not bundled in this repo, so install it separately if you want local Supabase
commands.

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
- `src/types/supabase.ts` is a checked-in schema snapshot for this implementation and should be regenerated from a real project once Supabase CLI is linked.
