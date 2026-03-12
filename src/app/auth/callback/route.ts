import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/patients';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Falta el código de autenticación.')}`);
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  const onboarding = await supabase.rpc('complete_user_onboarding');

  if (onboarding.error) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        onboarding.error.message === 'unauthorized_email'
          ? 'El email no está invitado en SkinTrack.'
          : onboarding.error.message,
      )}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
