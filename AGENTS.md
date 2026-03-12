# AGENTS.md — AI Context Router (source of truth)

## Stack

Next.js · Supabase · Supabase Auth · Tailwind CSS 4 · Motion · Shadcn/ui · HeroUI · Zustand · Zod · TypeScript · Vercel

## Product profile

This bootstrap is optimized for **small production apps** with **a small number of users**.

Default assumptions:
- Next.js app deployed on **Vercel**
- **Supabase** as the only backend service
- **Supabase Auth** for authentication
- **Zustand** for client-side UI/app state
- **Zod** for input and form validation
- Project documentation lives in a separate **orphan Git branch named `docs`** using **Mintlify** at the branch root

## Always read (project-specific)
- context/project/00_PROJECT_CONTEXT.md
- context/project/01_ARCHITECTURE.md
- context/project/02_STANDARDS.md
- context/project/03_DECISIONS.md
- context/project/04_RUNBOOK.md

If anything conflicts, **context/project/03_DECISIONS.md** wins.

## Read when relevant (coding preferences / reusable)
- context/coding/00_CODING_PRINCIPLES.md
- context/coding/01_STYLE_GUIDE.md
- context/coding/02_ARCH_PATTERNS.md
- context/coding/03_TESTING_STRATEGY.md
- context/coding/04_SECURITY_BASELINES.md

## Non-negotiable constraints
- Minimal, scoped changes only (no unrelated refactors).
- Do **not** create new files unless they are required for the feature, fix, test coverage, README update, or docs-branch update. Prefer editing existing files when possible.
- If a refactor is needed, **propose it as a separate PR** — never mix refactors with feature work.
- Do NOT invent libraries, APIs, routes, or components — verify they exist.
- If info is missing, **do not invent**. Place a `// TODO:` comment explaining what's missing and ask.
- If there are 2+ valid approaches, list pros/cons for each and **pick one with a stated reason**.
- **Run the full QA pipeline before marking any task as done.** See `context/project/04_RUNBOOK.md § Quality Gate Pipeline`.
- **Never suppress lint, type, or test errors** without an inline comment explaining why. Suppressions without explanation are treated as broken code.
- **A task is NOT done if the pipeline is not green.** Partial completion with failing checks must be reported explicitly with the list of failing steps and their output.
- Every meaningful `feat`, `fix`, architecture change, setup change, or behavior change must update **`README.md` on the app branch**.
- Every meaningful `feat`, `fix`, architecture change, setup change, or behavior change must also update the **Mintlify docs in the `docs` branch**.
- Documentation changes must stay isolated: **never keep Mintlify docs files in app branches** if the `docs` branch exists.
- If a feature or bugfix is realistically testable, it must include automated test coverage. Missing tests make the task incomplete unless the limitation is explained explicitly.

## Required output format for every task
1) Assumptions / open questions — list anything unclear; **stop and ask** if critical
2) Plan (3–7 bullets)
3) Files to change (exact paths and branch name when relevant)
4) Implementation steps
5) Verification commands (lint → typecheck → tests → build)
6) Risks / edge cases
7) Delivery report (see `04_RUNBOOK.md § Delivery report`)

## No-code-until rule

> **Do NOT write or modify code until you have delivered items 1–4 above (Assumptions + Plan + Files + Verification commands).** If you are uncertain about any requirement, scope boundary, or technical constraint — stop and ask.
>
> Delivery sequence: **analyze → implement on app branch → run QA → update `docs` branch → deliver**.

## Definition of Done

The following requirements must be satisfied before a task is considered done:

1. Requested code or fix is implemented with scoped changes only.
2. `README.md` is updated when behavior, setup, architecture, or developer workflow changed.
3. The `docs` branch Mintlify site is updated when behavior, setup, architecture, or developer workflow changed.
4. Relevant automated tests were added or updated when the change was testable.
5. The pipeline below passes **in this exact order** with zero errors on the app branch.

| Step | Command |
|---|---|
| 1. JS/TS lint | `npm run lint` |
| 2. TypeScript check | `npx tsc --noEmit` |
| 3. JS tests | `npm run test` |
| 4. Production build | `npm run build` |

Prefer `npm run qa` when available (see `04_RUNBOOK.md § Canonical pipeline levels`).

**Deviations** require explicit documentation: which step was skipped, why, and what manual verification replaced it.

**No breaking changes** outside the requested scope.

## Fallback: command-less environments

If the agent environment cannot execute commands (sandboxed, read-only context):
1. Provide the exact commands from the pipeline above.
2. Request the output from the user.
3. Use the output to identify and fix issues.
4. Do not claim the task is done until the user confirms all steps pass.
5. If docs also changed, provide the exact `git switch docs` and Mintlify update commands.

## Agent Compatibility

This file is the **universal entry point** for all AI coding agents:

| Agent / IDE | How it discovers context |
|---|---|
| **OpenAI Codex** | Reads `AGENTS.md` at repo root automatically |
| **Antigravity** | Reads `.agent/rules/00_PROJECT_RULE.md` → which redirects here |
| **Trae** | Reads `.trae/rules/00_PROJECT_RULE.md` → which redirects here |
| **Cursor / Other** | Reads `AGENTS.md` at repo root (emerging convention) |

All context lives in `context/` — bridge files in `.agent/` and `.trae/` are minimal redirectors.

## How to update this context

- Use `[CONTEXT-UPDATE]` prompts to signal a context modification request.
- Only edit files under `context/**`, `AGENTS.md`, and `README.md` on app branches.
- Update Mintlify docs only inside the `docs` branch.
- Never modify bridge files (`.agent/`, `.trae/`) unless the routing structure itself changes.
- Choose the right target file using the mapping below:

| If the rule is about… | Target file |
|---|---|
| Architectural decision or invariant | `context/project/03_DECISIONS.md` |
| Naming, formatting, or convention | `context/project/02_STANDARDS.md` |
| Setup, dev, or verification command | `context/project/04_RUNBOOK.md` |
| Stack overview or directory layout | `context/project/00_PROJECT_CONTEXT.md` |
| Layer boundaries or data flow | `context/project/01_ARCHITECTURE.md` |
| Coding pattern or anti-pattern | `context/coding/02_ARCH_PATTERNS.md` |
| Testing rule or coverage | `context/coding/03_TESTING_STRATEGY.md` |
| Security expectation | `context/coding/04_SECURITY_BASELINES.md` |
| General coding principle | `context/coding/00_CODING_PRINCIPLES.md` |
| Code style / formatting | `context/coding/01_STYLE_GUIDE.md` |
| README or developer-facing docs on app branches | `README.md` |
| Mintlify docs site content | `docs` branch root (`docs.json`, `*.mdx`) |
| Router, agent compatibility, output format | `AGENTS.md` |
