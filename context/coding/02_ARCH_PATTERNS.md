# Architecture Patterns (reusable)

## ✅ Preferred Patterns

### Data Fetching (Server Components)

- Fetch initial data in async Server Components.
- Use `Promise.all()` for independent queries.
- Use Suspense for non-critical loading paths.

```tsx
export default async function ProjectsPage() {
  const supabase = await createServerClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status')
    .order('created_at', { ascending: false })

  return <ProjectList projects={projects ?? []} />
}
```

### Mutations (Server Actions)

- Call Server Actions directly from forms or event handlers.
- Validate with Zod first.
- Check auth before DB access.

```tsx
import { createProject } from '@/lib/actions/project-actions'

export default function NewProjectPage() {
  return (
    <form action={createProject}>
      <input name="name" type="text" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

### Zustand Pattern

Use Zustand only for state owned by the browser.

Good fits:
- modal open/close
- sidebar state
- local filters
- multi-step flows
- optimistic local interactions

```ts
import { create } from 'zustand'

type CreateProjectModalStore = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useCreateProjectModalStore = create<CreateProjectModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
```

Do not use Zustand for the primary source of truth of Supabase rows.

### Auth Patterns

- Always call `getUser()`, never `getSession()` for auth checks.
- Protect route groups with middleware.

### Motion & Animations

- Keep variants as module-level constants.
- Use `LazyMotion` in a client-side providers wrapper.
- Use `AnimatePresence` for enter/exit.

## ❌ Anti-Patterns to Avoid

### Server / Client Boundary

- ❌ No `useEffect` for initial data fetching.
- ❌ No broad `'use client'` usage high in the tree.
- ❌ No non-serializable props across RSC boundaries.

### Zustand

- ❌ Do not mirror whole Supabase tables into global client state.
- ❌ Do not treat Zustand as the source of truth for auth or permissions.
- ❌ Do not replace server-first rendering with store-driven fetching.

### Auth & Security

- ❌ No `getSession()` for secure auth checks.
- ❌ No service-role key in Client Components.
- ❌ No skipping Zod validation.

### Next.js Specifics

- ❌ No Route Handlers for internal mutations.
- ❌ No Pages Router patterns.

### Animations

- ❌ No `framer-motion` imports.
- ❌ No Motion in Server Components.
- ❌ No inline animation variants inside JSX.
