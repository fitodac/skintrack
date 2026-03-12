# Next + Supabase AI Context Bootstrap

A small bootstrap for building **small apps** with:

- Next.js
- Supabase
- Supabase Auth
- Tailwind CSS 4
- Motion
- Shadcn/ui or HeroUI
- Zustand
- Zod
- Vercel

The goal is simple:

- generate clean code
- keep architecture scalable
- avoid random patterns
- keep docs updated
- write tests when the feature can be tested

## How this bootstrap works

The main entry file for AI agents is:

```md
AGENTS.md
```

That file sends the agent to the real source of truth inside `context/`.

Project rules live here:

```txt
context/project/
```

Reusable coding rules live here:

```txt
context/coding/
```

## Main ideas

### 1. Small app profile

This bootstrap is designed for apps with a **small number of users**.

Example:

```txt
A dashboard for 5 to 30 people inside a team
```

### 2. Server-first architecture

Use Server Components by default.

```tsx
export default async function ProjectsPage() {
  return <div>Projects</div>
}
```

Only use client components when you really need browser interactivity.

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 3. Zustand is for client state only

Good use:

```ts
import { create } from 'zustand'

type ModalStore = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
```

Bad use:

```ts
// Do not use Zustand as the main source of truth for Supabase table data
```

### 4. Zod validates input

```ts
import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1),
})
```

### 5. Documentation is part of the work

Every meaningful feature or fix must update:

- `README.md` on the app branch
- the Mintlify docs in the `docs` branch

Example workflow:

```bash
git switch main
# change app code
# update README.md

npm run lint
npx tsc --noEmit
npm run test
npm run build

git switch docs
# update docs.json and .mdx pages
```

Mintlify uses a required `docs.json` file as the core config file, navigation must explicitly list page paths, and the CLI can be installed with `npm i -g mint` and previewed locally with `mint dev`. citeturn550955search0turn315145view1turn315145view0

### 6. Test what can be tested

If the change is testable, it must include tests.

```ts
import { describe, it, expect } from 'vitest'

describe('createProjectSchema', () => {
  it('rejects empty name', () => {
    expect(() => createProjectSchema.parse({ name: '' })).toThrow()
  })
})
```

## Suggested workflow

```txt
1. Read AGENTS.md
2. Build or fix the feature on the app branch
3. Update README.md
4. Run lint, typecheck, tests, and build
5. Switch to docs branch
6. Update Mintlify docs
7. Commit each branch separately
```

## Why this is useful

Because the agent stops behaving like:

```txt
"I created something that works... maybe"
```

And starts behaving more like:

```txt
"I changed only what was needed, documented it, and verified it"
```
