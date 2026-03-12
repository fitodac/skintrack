# 00 Project Context

## Purpose

This repository is a **reusable AI-context bootstrap** for projects built with the stack below. It gives AI coding agents (Codex, Antigravity, Trae, Cursor, etc.) a shared understanding of the project's architecture, conventions, delivery rules, documentation workflow, and testing requirements before writing code.

> Copy this scaffold into a new project, adjust project-specific details, and every AI agent starts from the same playbook.

## Product Profile

This bootstrap is optimized for **small production applications** with **a small number of users**.

Default product assumptions:
- Deploy the app to **Vercel**
- Use **Supabase** as the only backend service
- Use **Supabase Auth** for authentication
- Use **Zustand** for client-side UI/app state
- Use **Zod** for form and input validation
- Keep project docs in a separate **orphan Git branch named `docs`** using **Mintlify**
- Prefer simple, scalable patterns over heavy enterprise ceremony

## Stack Manifest

| Technology | Role | Version Constraint |
|---|---|---|
| **Next.js** | Full-stack React framework (App Router, RSC, Server Actions, Route Handlers) | 15+ |
| **Supabase** | Backend-as-a-Service (PostgreSQL DB, Auth, Storage, Realtime, Edge Functions) | latest JS SDK |
| **Supabase Auth** | Authentication and session management via SSR-friendly cookies | latest |
| **Tailwind CSS** | Utility-first CSS framework (CSS-first config) | 4+ |
| **Shadcn/ui** | Accessible component primitives (Radix-based, copied into project) | latest |
| **HeroUI** | Complementary component library (npm package, ex-NextUI) | latest |
| **Motion** | Animation library (ex-Framer Motion) | latest |
| **Zustand** | Client-owned state for UI and ephemeral app state | 5+ |
| **TypeScript** | Type safety across the entire codebase | 5+ |
| **Zod** | Schema validation for forms, Server Actions, and API inputs | 3+ |
| **Vercel** | Primary deployment target for the Next.js app | latest |
| **Mintlify** | Documentation site generator living in the separate `docs` branch | latest |

## Stack Roles Summary

- **Next.js App Router** owns routing, layouts, middleware, authentication guards, SSR/SSG/ISR, and Server Actions for mutations. React Server Components (RSC) are the default; Client Components (`'use client'`) are opt-in.
- **Supabase** is the single backend service: PostgreSQL database, auth, file storage, and optional Realtime subscriptions.
- **Supabase Auth** manages login, logout, password reset, and session refresh through SSR-compatible cookies and middleware.
- **Server Actions** handle internal data mutations directly from Server Components or Client Components — no separate REST API layer is needed for internal operations.
- **Route Handlers** (`app/api/`) are used only for webhooks, external integrations, or cases where a real HTTP endpoint is required.
- **Tailwind 4** provides styling via a CSS-first configuration (`@theme` directive, no `tailwind.config.js`).
- **Shadcn/ui** supplies accessible, customizable primitives that live **inside the project** at `src/components/ui/`.
- **HeroUI** complements Shadcn with extra npm-installed UI components when needed.
- **Motion** handles animations declaratively via `motion/react`.
- **Zustand** is used only for client-owned state such as modals, filters, wizard steps, optimistic UI, and ephemeral app state.
- **Zod** validates all external input on the server and should also back form validation on the client when useful.
- **Vercel** is the default deployment target for the app.
- **Mintlify** powers the documentation site inside the separate `docs` branch. That branch keeps docs isolated from app branches.

## Package Manager

| Scope | Manager | Lock File |
|---|---|---|
| JS/TS dependencies | npm _or_ pnpm | `package-lock.json` / `pnpm-lock.yaml` |

## Key Directories (Next.js App Router layout)

```txt
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, providers, Motion LazyMotion)
│   ├── page.tsx                # Home page (Server Component by default)
│   ├── (auth)/                 # Auth route group (login, signup, reset)
│   │   └── login/page.tsx
│   ├── (app)/                  # Protected route group (requires session)
│   │   ├── layout.tsx          # App shell layout (sidebar, nav)
│   │   └── dashboard/page.tsx
│   └── api/                    # Route Handlers (webhooks, external integrations only)
│       └── webhooks/route.ts
├── components/
│   ├── ui/                     # Shadcn/ui primitives (editable source)
│   └── [feature]/              # Feature-specific components (PascalCase)
├── lib/
│   ├── supabase/
│   │   ├── server.ts           # createServerClient (RSC, Server Actions, Route Handlers)
│   │   └── client.ts           # createBrowserClient (Client Components)
│   ├── actions/                # Server Actions (grouped by domain)
│   ├── validations/            # Zod schemas
│   ├── utils.ts                # cn() and general utilities
│   └── motion.ts               # Shared Motion variant constants
├── stores/                     # Zustand stores for client-owned state only
├── types/
│   └── supabase.ts             # Auto-generated Supabase DB types (via CLI)
└── middleware.ts               # Auth session refresh (Supabase SSR)

public/                         # Static assets
README.md                       # Human-friendly project overview on the app branch
```

## Documentation Branch Layout (`docs` branch)

The `docs` branch is an **orphan branch** dedicated to Mintlify docs only.

```txt
docs.json                       # Required Mintlify config at branch root
index.mdx                       # Docs landing page
getting-started/*.mdx           # Setup and bootstrap docs
conventions/*.mdx               # Architecture and coding conventions
workflows/*.mdx                 # Documentation workflow guides
```
