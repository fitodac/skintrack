'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/action-result';
import { requireViewer } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { updateOwnProfileSchema, updatePasswordSchema } from '@/modules/profile/schemas';

export async function updateOwnProfile(input: unknown): Promise<ActionState> {
  const parsed = updateOwnProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const viewer = await requireViewer();
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      username: parsed.data.username,
      name: parsed.data.name,
      lastname: parsed.data.lastname,
      professional_title: parsed.data.professional_title ?? null,
    })
    .eq('id', viewer.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  return { success: 'Perfil actualizado.' };
}

export async function updateOwnPassword(input: unknown): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Contraseña actualizada.' };
}
