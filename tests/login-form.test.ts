import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('LoginForm source', () => {
  it('does not define an inline server action for Google sign-in', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/modules/auth/components/login-form.tsx'),
      'utf8',
    );

    expect(source).not.toContain('<form action={async () => signInWithGoogle(next)}>');
    expect(source).toContain('onClick={() => {');
    expect(source).toContain('await signInWithGoogle(next);');
  });
});
