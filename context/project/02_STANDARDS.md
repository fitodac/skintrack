# 02 Standards

## File & Directory Naming

| Scope | Convention | Example |
|---|---|---|
| Next.js pages & layouts | lowercase + `page.tsx` / `layout.tsx` | `app/dashboard/page.tsx` |
| Route groups | kebab-case in parentheses | `app/(app)/dashboard/` |
| React components | PascalCase | `components/UserAvatar.tsx` |
| Shadcn/ui primitives | kebab-case file, PascalCase export | `components/ui/dropdown-menu.tsx` → `DropdownMenu` |
| Server Actions | camelCase function, file kebab-case | `lib/actions/user-actions.ts` → `createUser()` |
| Zod schemas | camelCase + `Schema` suffix | `lib/validations/user.ts` → `createUserSchema` |
| Zustand stores | camelCase hook + `Store` suffix | `stores/use-sidebar-store.ts` → `useSidebarStore()` |
| Supabase clients | descriptive | `lib/supabase/server.ts`, `lib/supabase/client.ts` |
| Motion variants | camelCase constant | `lib/motion.ts` → `fadeIn`, `slideUp` |
| Hooks | camelCase + `use` prefix | `lib/hooks/useUser.ts` |
| Directories | kebab-case | `src/lib/`, `src/components/` |
| Type files | PascalCase or descriptive | `types/supabase.ts`, `types/index.ts` |
| Mintlify docs pages (docs branch) | kebab-case `.mdx` | `getting-started/overview.mdx` |

## Component Export Rules

- **Next.js pages and layouts**: Use `export default` (required by Next.js file-based routing).
- **All other components**: Use **named exports** for consistent, searchable imports.

```tsx
// ✅ Page component (app/dashboard/page.tsx)
export default function DashboardPage() { return <div /> }

// ✅ Shared component (components/StatCard.tsx)
export function StatCard({ title, value }: StatCardProps) {
  return <div>{title}: {value}</div>
}
```

## Server vs. Client Component Rules

- **Default is Server Component.** No directive needed.
- **Add `'use client'` only when** the component needs: `useState`, `useEffect`, event handlers, browser APIs, Motion, or Zustand.
- **Keep client boundaries low** in the tree.
- **Never fetch initial data in `useEffect`** when Server Components can do it.

## Documentation Update Rules

Every meaningful `feat`, `fix`, setup change, architecture change, or behavior change must update:

1. `README.md` on the current app branch
2. Mintlify docs on the `docs` branch

Documentation style rules:
- Keep explanations short, simple, and beginner-friendly.
- Write as if explaining to a teenager.
- Include practical code examples whenever useful.
- Avoid unnecessary verbosity.
- Mintlify docs are written in **English** unless the user explicitly asks for another language.

## Docs Branch Rules

The `docs` branch is a dedicated Mintlify branch.

Rules:
- Keep it **docs-only**.
- Put `docs.json` at the branch root.
- Put `.mdx` pages at the branch root or inside topic folders.
- Update `docs.json` navigation whenever you add or remove pages.
- Do not mirror app source code into the `docs` branch.
- Do not keep Mintlify docs files in app branches if the `docs` branch exists.

## Delivery Checklist

Every completed task must include:

1. **Code changes** only within the approved scope.
2. **README update** if setup, behavior, architecture, or workflow changed.
3. **Docs-branch update** if setup, behavior, architecture, or workflow changed.
4. **Tests** if the change is testable.
5. **Verification** with the full QA pipeline on the app branch.
6. **Breaking changes** — if any, called out explicitly.
7. **Migration** — if DB schema changed, include the Supabase migration file.

## Path Boundary Policy

> See **ADR-007** in `context/project/03_DECISIONS.md` for the rationale.

Before modifying any file, check it against the boundary lists below.

### Allowed roots on app branches (safe to edit)

| Path | Scope |
|---|---|
| `src/app/**` | Next.js pages, layouts, and route handlers |
| `src/components/**` | React components and Shadcn/ui primitives |
| `src/lib/**` | Utilities, hooks, Server Actions, Supabase clients |
| `src/stores/**` | Zustand stores |
| `src/types/**` | TypeScript types (auto-generated Supabase types are regenerated, not hand-edited) |
| `context/**` | AI context files (with `[CONTEXT-UPDATE]` prompts) |
| `tests/**` | Test files |
| `supabase/migrations/**` | Database migrations (Supabase CLI) |
| `README.md` | Human-friendly project overview |

### Allowed roots on the `docs` branch

| Path | Scope |
|---|---|
| `docs.json` | Mintlify global config |
| `*.mdx` | Root docs pages |
| `getting-started/**` | Setup and onboarding docs |
| `conventions/**` | Architecture and coding docs |
| `workflows/**` | Documentation and maintenance docs |
| `images/**` | Static docs assets if needed |

### Forbidden roots (ask before touching)

| Path | Why |
|---|---|
| `supabase/seed.sql` | Shared seed data — changes affect all environments |
| `src/middleware.ts` | Auth session logic — incorrect changes break all protected routes |
| `.env.local` / `.env` | Secrets and environment config |
| `next.config.ts` | Framework-level settings |
| `postcss.config.mjs` | Build pipeline config |
| Mintlify docs files on app branches | Docs must stay isolated in `docs` branch |

### Exception process

If a task **cannot be completed** without modifying a forbidden root:
1. **Stop.** Do not write any code in forbidden paths.
2. **State** which forbidden file(s) you need to modify and why.
3. **Wait** for explicit permission before proceeding.
