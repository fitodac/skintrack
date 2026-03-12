'use server';

import { redirect } from 'next/navigation';
import { getPublicEnv } from '@/lib/env';
import { createServerClient } from '@/lib/supabase/server';
import { signInWithPasswordSchema } from '@/modules/auth/schemas';
import type { ActionState } from '@/lib/action-result';

export async function signInWithPassword(input: unknown): Promise<ActionState<{ redirectTo: string }>> {
  const parsed = signInWithPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? 'No se pudo validar el formulario.',
    };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const onboardingResult = await supabase.rpc('complete_user_onboarding');

  if (onboardingResult.error) {
    await supabase.auth.signOut();
    return {
      error:
        onboardingResult.error.message === 'unauthorized_email'
          ? 'Tu email todavía no está autorizado para usar SkinTrack.'
          : onboardingResult.error.message,
    };
  }

  return {
    data: {
      redirectTo: parsed.data.next || '/patients',
    },
    success: 'Ingreso correcto.',
  };
}

export async function signInWithGoogle(next = '/patients') {
  const supabase = await createServerClient();
  const env = getPublicEnv();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
