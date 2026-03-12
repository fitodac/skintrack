# 03 Decisions (ADR Log)

> **This file is the source of truth.** If anything in the context files conflicts, what's written here wins.

---

## ADR-001: Next.js App Router over Pages Router

**Status:** Accepted

**Decision:** Use Next.js 15 App Router exclusively. No Pages Router (`pages/` directory).

**Consequences:**
- Server Components are the default.
- Data fetching happens directly in Server Components.
- Server Actions replace REST mutations for internal operations.

---

## ADR-002: Supabase as the Primary Backend Service

**Status:** Accepted

**Decision:** Use Supabase as the single BaaS provider.

**Consequences:**
- Separate server and browser clients.
- RLS is mandatory on every table.
- Supabase types are generated, not handwritten.

---

## ADR-003: Server Actions for Mutations (No Separate API Layer)

**Status:** Accepted

**Decision:** All internal mutations go through Next.js Server Actions.

**Consequences:**
- Validate with Zod.
- Check auth before DB access.
- Revalidate cache after mutations.

---

## ADR-004: Tailwind CSS 4 with CSS-First Configuration

**Status:** Accepted

**Decision:** Use Tailwind 4 with `@theme`.

**Consequences:**
- No `tailwind.config.js` unless a plugin forces it.
- Tokens live in CSS.

---

## ADR-005: Shadcn/ui as Primary + HeroUI as Complement

**Status:** Accepted

**Decision:** Shadcn/ui is primary. HeroUI is complementary.

**Consequences:**
- Shadcn components are project-owned.
- HeroUI components are wrapped or extended, not forked.

---

## ADR-006: Motion (ex-Framer Motion) for Animations

**Status:** Accepted

**Decision:** Use `motion/react` for animations.

**Consequences:**
- Motion only in Client Components.
- Prefer transform + opacity.
- Use `LazyMotion` at the app root.

---

## ADR-007: Path Boundary Policy (Allowed vs Forbidden Roots)

**Status:** Accepted

**Decision:** Maintain explicit allowed/forbidden root lists in `context/project/02_STANDARDS.md`.

**Consequences:**
- Agents must check paths before writing code.
- Forbidden roots require explicit permission.

---

## ADR-008: QA as a Project-Level Invariant

**Status:** Accepted

**Decision:** The QA pipeline is a non-negotiable delivery gate.

**Consequences:**
- Lint, typecheck, tests, and build define done.
- Silent skips are not allowed.

---

## ADR-009: Conflict Resolution — This File Wins

**Status:** Accepted

**Decision:** If any context file contradicts this ADR log, this file takes precedence.

---

## ADR-010: Small-App Production Profile

**Status:** Accepted

**Decision:** This bootstrap is optimized for small production apps with a small number of users.

**Consequences:**
- Prefer simple, maintainable patterns.
- Avoid architecture that only makes sense for large multi-team systems.
- Vercel is the default deployment target.

---

## ADR-011: Zustand for Client State Only

**Status:** Accepted

**Decision:** Zustand is used only for client-owned UI/app state.

**Consequences:**
- Good fits: modals, filters, wizard steps, optimistic local state, toasts.
- Do not use Zustand as the primary source of truth for Supabase data.
- Server data stays server-first through RSC, Server Actions, and Supabase.

---

## ADR-012: README Is Living Documentation

**Status:** Accepted

**Decision:** Every meaningful feature, fix, setup change, architecture change, or behavior change must update `README.md` on the current app branch.

**Consequences:**
- README updates are part of delivery, not optional follow-up work.
- Explanations stay short, simple, and example-driven.
- Missing README updates mean the task is incomplete.

---

## ADR-013: Mintlify Docs Live in an Orphan `docs` Branch

**Status:** Accepted

**Decision:** Project documentation uses Mintlify and lives in a separate orphan Git branch named `docs`. The branch root contains the Mintlify project (`docs.json` + `.mdx` pages).

**Consequences:**
- App branches must not keep Mintlify docs files when the `docs` branch exists.
- To update docs, switch to `docs`, edit the Mintlify site, and commit there.
- The `docs` branch stays docs-only so documentation changes do not pollute app branches.

---

## ADR-014: Testable Changes Require Tests

**Status:** Accepted

**Decision:** Every realistically testable feature or bugfix must include automated test coverage.

**Consequences:**
- New behavior requires tests.
- Bugfixes should add regression tests when practical.
- If a change is not realistically testable, delivery must explain why.
