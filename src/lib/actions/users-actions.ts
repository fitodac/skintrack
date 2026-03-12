'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/action-result';
import { requireSuperadmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerClient } from '@/lib/supabase/server';
import { getPublicEnv } from '@/lib/env';
import { inviteUserSchema } from '@/modules/auth/schemas';
import { updateUserBySuperadminSchema } from '@/modules/users/schemas';

export async function inviteUser(input: unknown): Promise<ActionState> {
  const parsed = inviteUserSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const viewer = await requireSuperadmin();
  const supabase = await createServerClient();
  const adminClient = createAdminClient();
  const env = getPublicEnv();

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', parsed.data.email.toLowerCase())
    .maybeSingle();

  if (existingProfile) {
    const { error } = await supabase
      .from('profiles')
      .update({
        role: parsed.data.role,
        name: parsed.data.invited_name,
        lastname: parsed.data.invited_lastname,
        professional_title: parsed.data.professional_title ?? null,
      })
      .eq('id', existingProfile.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: 'El usuario ya existía y se actualizó su perfil.' };
  }

  const { error: invitationError } = await adminClient.auth.admin.inviteUserByEmail(
    parsed.data.email.toLowerCase(),
    {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/patients`,
      data: {
        invited_name: parsed.data.invited_name,
        invited_lastname: parsed.data.invited_lastname,
      },
    },
  );

  if (invitationError) {
    return { error: invitationError.message };
  }

  const { error } = await supabase.from('user_invitations').upsert(
    {
      email: parsed.data.email.toLowerCase(),
      role: parsed.data.role,
      invited_name: parsed.data.invited_name,
      invited_lastname: parsed.data.invited_lastname,
      professional_title: parsed.data.professional_title ?? null,
      invited_by: viewer.id,
      invitation_status: 'pending',
      accepted_at: null,
    },
    { onConflict: 'email' },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: 'Invitación enviada.' };
}

export async function updateUserBySuperadmin(input: unknown): Promise<ActionState> {
  const parsed = updateUserBySuperadminSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  await requireSuperadmin();
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      username: parsed.data.username,
      name: parsed.data.name,
      lastname: parsed.data.lastname,
      professional_title: parsed.data.professional_title ?? null,
      role: parsed.data.role,
      is_active: parsed.data.is_active,
    })
    .eq('id', parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: 'Usuario actualizado.' };
}
