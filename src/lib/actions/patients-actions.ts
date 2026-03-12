'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/action-result';
import { requireViewer } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { patientFormSchema } from '@/modules/patients/schemas';

export async function createPatient(input: unknown): Promise<ActionState<{ id: string }>> {
  const parsed = patientFormSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const viewer = await requireViewer();
  const supabase = await createServerClient();
  const ownerId =
    viewer.role === 'superadmin' ? parsed.data.admin_user_id ?? viewer.id : viewer.id;

  const { data, error } = await supabase
    .from('patients')
    .insert({
      ...parsed.data,
      admin_user_id: ownerId,
      created_by: viewer.id,
      updated_by: viewer.id,
    })
    .select('id')
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/patients');
  return {
    success: 'Paciente creado.',
    data,
  };
}

export async function updatePatient(input: unknown): Promise<ActionState<{ id: string }>> {
  const parsed = patientFormSchema.safeParse(input);

  if (!parsed.success || !parsed.data.id) {
    return { error: parsed.success ? 'Falta el identificador del paciente.' : parsed.error.issues[0]?.message };
  }

  const viewer = await requireViewer();
  const supabase = await createServerClient();
  const ownerId =
    viewer.role === 'superadmin' ? parsed.data.admin_user_id ?? viewer.id : viewer.id;

  const { error } = await supabase
    .from('patients')
    .update({
      ...parsed.data,
      admin_user_id: ownerId,
      updated_by: viewer.id,
    })
    .eq('id', parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/patients');
  revalidatePath(`/patients/${parsed.data.id}`);
  return {
    success: 'Paciente actualizado.',
    data: {
      id: parsed.data.id,
    },
  };
}
