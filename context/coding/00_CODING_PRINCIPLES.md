# Coding Principles (reusable)

## Universal

- **Clarity over cleverness.** Write code a junior developer can read without comments.
- **Keep diffs small and scoped.** One concern per change; no unrelated refactors.
- **Don't change behavior unless requested.** Preserve existing contracts.
- **Add or adjust tests for every behavior change** when the change is realistically testable.
- **Update `README.md` and the `docs` branch docs** for meaningful product or workflow changes.

## Server vs. Client Components

- **Default to Server Components.** Only add `'use client'` when the component genuinely needs browser APIs, event handlers, `useState`, `useEffect`, Zustand, or Motion.
- **Keep `'use client'` boundaries as low as possible.**
- **Never fetch data in Client Components with `useEffect`.**
- **Pass serializable props only** from Server Components to Client Components.

## Server Actions

- **Always validate with Zod.**
- **Always verify auth.**
- **Return typed results.**
- **Revalidate after mutations.**

## Supabase

- **RLS is mandatory on every table.**
- **Use the correct client.**
- **Never use the service_role key in Client Components.**
- **Use auto-generated types.**
- **Prefer explicit columns** over `select('*')`.

## Zustand

- **Use Zustand only for client-owned state.**
- **Good fits:** modals, filters, tabs, wizard steps, local optimistic state.
- **Bad fits:** primary server data, auth truth, or replacing RSC data flow.

## Frontend (React)

- **Component composition over prop drilling.**
- **Explicit prop typing.**
- **Named exports** for all components except Next.js pages and layouts.
- **Colocate related files.**

## Styling (Tailwind 4 + Shadcn + HeroUI)

- **Utility-first.**
- **`@theme` for tokens.**
- **Don't mix component sources** for the same element type.
- **Use `cn()` utility** for merged class names.

## Animations (Motion)

- **Animate only GPU-friendly properties.**
- **Define variants outside components.**
- **Motion requires `'use client'`.**
- **Use `LazyMotion`** at the app root.
- **Respect `prefers-reduced-motion`.**

## Quality & Verification

- **The pipeline is the final arbiter.**
- **Fix errors at the source.**
- **Type safety is not optional.**
- **Tests must be meaningful.**
