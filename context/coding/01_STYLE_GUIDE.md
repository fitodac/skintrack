# Style Guide (reusable)

## TypeScript / JSX

- **Single quotes**, **trailing commas**, **2-space indent**, **semicolons**.
- Max line length: 100 chars (soft limit — don't break readability to enforce it).
- Component files: one component per file; filename matches the component name.
- Hooks: prefix custom hooks with `use` (`useUser`, `useDebounce`).
- Avoid `any`. Use `unknown` + type narrowing if the type is truly dynamic.
- Server Actions files: `'use server'` directive at the top of the file (file-level, not per-function).
- Client Components: `'use client'` as the very first line of the file.

```tsx
// Server Component (no directive needed — default)
import { createServerClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/ProjectCard'

export default async function ProjectsPage() {
  const supabase = await createServerClient()
  const { data: projects } = await supabase.from('projects').select('id, name, created_at')

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  )
}
```

```tsx
// Client Component with Motion animation
'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { fadeIn } from '@/lib/motion'
import type { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <motion.li
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn('rounded-xl border p-6', className)}
    >
      <h3 className="text-lg font-semibold">{project.name}</h3>
    </motion.li>
  )
}
```

## Server Actions

```ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

const updateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
})

export async function updateProject(input: unknown) {
  const parsed = updateProjectSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('projects')
    .update({ name: parsed.data.name })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/projects')
  return { data }
}
```

## Motion Variants (lib/motion.ts)

```ts
// lib/motion.ts — shared animation constants
import type { Variants } from 'motion/react'

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
}

export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.07 },
  },
}
```

## Supabase Client Setup

```ts
// lib/supabase/server.ts — for RSC, Server Actions, Route Handlers, middleware
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Server Component — ignore */ }
        },
      },
    }
  )
}
```

```ts
// lib/supabase/client.ts — for Client Components only
'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClientClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## CSS (Tailwind 4)

- Entry point: `src/app/globals.css`.
- First line: `@import "tailwindcss";`
- Tokens inside `@theme { ... }` block using CSS custom properties.
- Custom utilities: use `@utility` directive (not `@layer components` from TW3).
- No `tailwind.config.js` — all theme config is CSS-side.

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.25 260);
  --color-surface: oklch(0.15 0.01 260);
  --font-sans: 'Inter', sans-serif;
  --radius-lg: 0.75rem;
}
```

## File Organization Recap

| Path | Content | Convention |
|---|---|---|
| `src/app/**/page.tsx` | Next.js page (route-bound RSC) | `export default`, async |
| `src/app/**/layout.tsx` | Next.js layout | `export default` |
| `src/components/` | Feature & shared components | PascalCase, named exports |
| `src/components/ui/` | Shadcn/ui primitives | kebab-case file, PascalCase export |
| `src/lib/actions/` | Server Actions | camelCase functions, `'use server'` |
| `src/lib/validations/` | Zod schemas | camelCase + `Schema` suffix |
| `src/lib/supabase/` | Supabase client factories | `server.ts`, `client.ts` |
| `src/lib/motion.ts` | Shared Motion variant constants | camelCase exports |
| `src/lib/utils.ts` | `cn()` and general utilities | camelCase exports |
| `src/types/supabase.ts` | Auto-generated DB types | Do not edit by hand |
| `src/middleware.ts` | Auth session refresh | Single file |
