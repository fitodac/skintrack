# 01 Architecture

## Philosophy: Full-Stack React with BaaS

This stack follows a **server-first** approach: Next.js App Router renders React Server Components on the server by default, fetching data directly from Supabase without a separate API layer. Client Components are an opt-in escape hatch for interactivity. Mutations flow through Server Actions with Zod validation before reaching Supabase. Zustand is reserved for client-owned state only.

## Layer Diagram

```txt
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │             Next.js App (React)                  │   │
│  │                                                  │   │
│  │  ┌──────────────────┐  ┌──────────────────────┐ │   │
│  │  │  Server Component│  │  Client Component    │ │   │
│  │  │  (default, RSC)  │  │  ('use client')      │ │   │
│  │  │  · data fetching │  │  · UI state          │ │   │
│  │  │  · no JS bundle  │  │  · Zustand           │ │   │
│  │  │  · Shadcn/HeroUI │  │  · Motion animations │ │   │
│  │  │  · Tailwind 4    │  │  · Realtime          │ │   │
│  │  └────────┬─────────┘  └──────────┬───────────┘ │   │
│  └───────────┼───────────────────────┼─────────────┘   │
└──────────────┼───────────────────────┼─────────────────┘
               │ Server Actions        │ Supabase Realtime
               │ (mutations)           │ (subscriptions)
┌──────────────┼───────────────────────┼─────────────────┐
│              ▼        NEXT.JS        ▼                 │
│  ┌─────────────────────┐  ┌───────────────────────┐   │
│  │   Server Actions    │  │    Route Handlers      │   │
│  │   (lib/actions/)    │  │   (app/api/ — only     │   │
│  │   · Zod validation  │  │   webhooks/external)   │   │
│  │   · Auth checks     │  │                        │   │
│  └──────────┬──────────┘  └────────────┬──────────┘   │
│             │                          │               │
│  ┌──────────▼──────────────────────────▼──────────┐   │
│  │              middleware.ts                      │   │
│  │         (session refresh, auth guards)         │   │
│  └──────────────────────┬─────────────────────────┘   │
└─────────────────────────┼─────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────┐
│                      SUPABASE                         │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │PostgreSQL│  │   Auth   │  │ Storage  │  │Realtime│ │
│  │(+RLS)    │  │(SSR/JWT) │  │(buckets) │  │(ws)   │ │
│  └──────────┘  └──────────┘  └──────────┘  └───────┘ │
└───────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Next.js App Router

| Layer | Responsibility |
|---|---|
| **Layouts** (`app/**/layout.tsx`) | Persistent UI shells (nav, sidebar, providers); define auth boundaries via route groups |
| **Pages** (`app/**/page.tsx`) | Route-bound Server Components; fetch data directly from Supabase via `createServerClient` |
| **Server Actions** (`lib/actions/`) | Handle all mutations; validate with Zod; check auth before every operation |
| **Route Handlers** (`app/api/`) | HTTP endpoints for webhooks and third-party integrations only — not for internal data fetching |
| **Middleware** (`middleware.ts`) | Refresh Supabase session cookies on every request; redirect unauthenticated users |
| **Client Components** | Interactive UI only; use `createBrowserClient` for Supabase Realtime or client-side auth state |
| **Zustand stores** (`src/stores/**`) | UI/app state that belongs to the browser only; never the primary source of server data |

### Supabase

| Service | Usage |
|---|---|
| **PostgreSQL** | Primary data store; accessed via `supabase-js` or Drizzle ORM |
| **Row Level Security (RLS)** | Authorization layer on every table — the last line of defense |
| **Auth** | Session management via cookies (SSR-compatible); provider-based or email/password |
| **Storage** | User file uploads; private buckets with signed URLs |
| **Realtime** | Live subscriptions in Client Components for collaborative or live-updating features |

### Documentation Architecture

| Branch | Responsibility |
|---|---|
| **App branches** (`main`, feature branches) | Application code, tests, root `README.md`, context files |
| **`docs` branch** | Mintlify docs only (`docs.json` + `.mdx` pages) |

The docs branch exists to keep documentation publishing assets isolated from product code. When docs need updates, switch to `docs`, edit the Mintlify site, commit there, and switch back.

### Rendering Strategies

| Strategy | When to Use |
|---|---|
| **RSC (default)** | Any page that reads data; reduces client JS bundle |
| **`'use client'`** | When you need `useState`, `useEffect`, event handlers, browser APIs, Zustand, or Motion animations |
| **SSG** (`generateStaticParams`) | Static marketing pages, blog posts with known slugs |
| **ISR** (`revalidate`) | Content that changes infrequently |
| **Dynamic** (no cache) | User-specific or real-time data |

### Auth Flow

```txt
Request → middleware.ts
  ├── supabase.auth.getUser() [verify JWT with Supabase]
  ├── If no session → redirect to /login
  └── If session → refresh cookie → continue to page

Page (RSC) → createServerClient() → supabase.auth.getUser()
  └── Pass user as prop to Client Components if needed
```

### Data Flow for Mutations

```txt
User action (Client Component)
  → call Server Action (lib/actions/domain.ts)
    → parse input with Zod schema
    → verify auth (createServerClient → getUser)
    → run Supabase query (RLS applies automatically)
    → revalidatePath() or revalidateTag()
    → return { success } or { error }
  → UI updates via React re-render
```

### Data Flow for Client State

```txt
User interaction
  → Client Component
    → Zustand store updates local UI state
      → component re-renders
```

Rules:
- Zustand is fine for modals, filters, toasts, wizard steps, and optimistic local state.
- Zustand is **not** the source of truth for Supabase tables.
- Fetch server data in RSC or Server Actions, not from global client stores.

## Build Tooling

| Tool | Purpose |
|---|---|
| **Next.js** | Build system, bundler, compiler |
| **PostCSS** | CSS compilation for Tailwind 4 |
| **ESLint** | JS/TS linting |
| **Prettier** | Code formatting |
| **Vitest** | Unit and component testing |
| **React Testing Library** | Component test utilities |
| **Supabase CLI** | DB migrations, type generation, local dev stack |
| **Mintlify CLI** | Preview and validate docs on the `docs` branch |
