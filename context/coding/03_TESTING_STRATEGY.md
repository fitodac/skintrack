# Testing Strategy (reusable)

## Mandatory Rule

A realistically testable change must include automated tests.

Expected behavior:
- Feature work → add tests for the new behavior.
- Bugfix work → add a regression test when practical.
- Refactors → keep existing tests green and add missing coverage if behavior was previously untested.

If a test is not added, the delivery must explain:
1. why the case is not realistically testable
2. what manual verification was performed

## Testing Layers

| Layer | Tool | Runs via | What to Test |
|---|---|---|---|
| Unit | Vitest | `npm run test` | Server Actions, utilities, Zod schemas, Zustand store logic |
| Component | Vitest + React Testing Library | `npm run test` | Client Component rendering, interactions, accessibility |
| Integration | Vitest + Supabase local | `npm run test` | Server Actions against a local Supabase instance |
| E2E (optional) | Playwright | `npx playwright test` | Critical user journeys end-to-end |

## Unit Tests (examples)

### Zod Schemas

```ts
import { describe, it, expect } from 'vitest'
import { createProjectSchema } from './project'

describe('createProjectSchema', () => {
  it('accepts valid input', () => {
    const result = createProjectSchema.safeParse({ name: 'My Project' })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createProjectSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })
})
```

### Zustand Stores

```ts
import { describe, it, expect } from 'vitest'
import { useCreateProjectModalStore } from './use-create-project-modal-store'

describe('useCreateProjectModalStore', () => {
  it('opens and closes the modal', () => {
    useCreateProjectModalStore.getState().open()
    expect(useCreateProjectModalStore.getState().isOpen).toBe(true)

    useCreateProjectModalStore.getState().close()
    expect(useCreateProjectModalStore.getState().isOpen).toBe(false)
  })
})
```

## Conventions

- Co-locate test files with source when that fits the project.
- Prefer `screen` queries and accessible selectors.
- Mock Motion in component tests.
- Mock `@/lib/supabase/server` in pure unit tests.

## Delivery-Time Checks

Run the complete pipeline before marking a task done:

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```
