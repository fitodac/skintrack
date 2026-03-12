# Security Baselines (reusable)

## Input Validation

- **All user input is validated server-side** via Zod schemas in Server Actions and Route Handlers. Client-side validation is a UX convenience, never a security measure.
- **Never trust client data.** Parse and validate types, ranges, formats, and business rules in every Server Action — even if the caller is a trusted Client Component.
- **Zod `safeParse` over `parse`.** Use `safeParse` to handle validation failures gracefully; return `{ error }` instead of throwing.

## XSS Prevention

- **React's JSX auto-escapes** all interpolated values — this is the primary defense.
- **Never use `dangerouslySetInnerHTML`** unless the input has been sanitized with a whitelist-based sanitizer (e.g., DOMPurify). Document the reason inline.
- **`next/image`** for all `<img>` tags — it prevents hotlinking and enforces safe image domains.

## Authentication & Authorization

### Authentication (Supabase Auth)

- Use Supabase Auth for all session management — email/password, magic links, or OAuth providers.
- Sessions are stored in cookies managed by `@supabase/ssr`. Never store session tokens in `localStorage`.
- **`middleware.ts` refreshes the session cookie on every request.** Without this, tokens expire silently.
- On the server, always use **`getUser()`** (not `getSession()`) to validate the JWT with Supabase servers. `getSession()` reads from the cookie and does not re-validate.

  ```ts
  // ✅ Validates with Supabase server
  const { data: { user } } = await supabase.auth.getUser()

  // ❌ Does not validate — can be spoofed
  const { data: { session } } = await supabase.auth.getSession()
  ```

### Authorization (Row Level Security)

- **RLS is mandatory on every table.** Enable RLS on all tables as a default, even if only authenticated users access them.
- **Write explicit policies for every operation** (SELECT, INSERT, UPDATE, DELETE). No table should have an implicit "allow all" policy.
- **Test RLS policies** in the Supabase SQL editor with different roles before shipping.
- **Never use the `service_role` key in Client Components.** It bypasses RLS completely — treat it like a root password. Use it only in server-side environments (Server Actions, Route Handlers) and only when you explicitly need to bypass RLS with documented justification.
- **Defense in depth:** Server Actions check auth with `getUser()` before executing queries. RLS provides a second layer — not the first.

  ```sql
  -- Example RLS policy
  create policy "Users can only read their own projects"
    on projects for select
    using (auth.uid() = user_id);

  create policy "Users can only insert their own projects"
    on projects for insert
    with check (auth.uid() = user_id);
  ```

## CSRF Protection

- **Next.js Server Actions include built-in CSRF protection** via the Origin check on POST requests. No additional CSRF configuration is needed for Server Actions.
- For Route Handlers, CSRF protection is not automatic — use `Origin` header checks or tokens for sensitive mutations.

## Secrets & Environment Variables

- **Never commit secrets to the repository.** All secrets go in `.env.local` (which is `.gitignore`d).
- **`NEXT_PUBLIC_*` variables are embedded in the client bundle** — never put secrets there.
- Only expose: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Keep server-only: `SUPABASE_SERVICE_ROLE_KEY` and any third-party API keys.
- Access secrets via `process.env.VAR_NAME` — only in server-side code (RSC, Server Actions, Route Handlers, middleware).
- For production: use Vercel Environment Variables, Railway, or a secrets manager.

  ```ts
  // ✅ Safe — server-only access
  export async function myAction() {
    const apiKey = process.env.THIRD_PARTY_API_KEY // server-side only
  }

  // ❌ Never — exposed to client bundle
  const apiKey = process.env.NEXT_PUBLIC_THIRD_PARTY_API_KEY
  ```

## Supabase Storage

- Use **private buckets** for user-generated content. Never make buckets public unless the content is truly public.
- Generate **signed URLs** with short expiry for serving private files.
- Validate file type, size, and MIME type in Server Actions before uploading.
- Never serve user-uploaded files with their original filename — use UUID-based paths.
- Define Storage RLS policies to control who can upload/download to each bucket.

## Dependency Policy

- **Audit regularly:**
  ```bash
  npm audit          # JS dependencies
  ```
- **Pin major versions** in `package.json`. Use `^` for minor/patch flexibility.
- **Review new dependencies** before adding: check maintenance status, download count, and known vulnerabilities.
- **Minimize dependencies.** Prefer native Web APIs and Next.js built-ins over adding packages.

## Headers & Transport Security

- Enforce HTTPS in production (Vercel / cloud providers do this automatically).
- Add security headers via `next.config.ts`:

  ```ts
  // next.config.ts
  const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains',
    },
  ]

  export default {
    headers: async () => [
      { source: '/(.*)', headers: securityHeaders },
    ],
  }
  ```

- **Content Security Policy (CSP):** Configure per project based on actual asset origins. At minimum, restrict `script-src` and `connect-src`.

## Rate Limiting

- Apply rate limiting to auth endpoints (login, signup, password reset) and any Route Handlers exposed publicly.
- Use Supabase's built-in auth rate limiting, or add middleware-level rate limiting with an edge-compatible library (e.g., `@upstash/ratelimit` with Redis).
- Default recommendation: 10 attempts/minute for auth endpoints.

## Server Action Security Checklist

Before shipping a Server Action, verify:

- [ ] Input is validated with a Zod schema (`safeParse` before any DB call)
- [ ] Auth is checked with `supabase.auth.getUser()` — not `getSession()`
- [ ] The operation is scoped to the authenticated user (e.g., `.eq('user_id', user.id)`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not used unless RLS bypass is intentional and documented
- [ ] Return value is `{ data, error }` — no raw exceptions thrown to the client
- [ ] `revalidatePath()` / `revalidateTag()` is called after successful mutations
