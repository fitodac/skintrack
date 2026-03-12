'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/action-result';
import { requireViewer } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { clinicalSessionFormSchema } from '@/modules/clinical-sessions/schemas';

export async function createSessionDraft(
  input: unknown,
): Promise<ActionState<{ id: string; lastSavedAt: string }>> {
  const parsed = clinicalSessionFormSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const viewer = await requireViewer();
  const supabase = await createServerClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('clinical_sessions')
    .insert({
      ...parsed.data,
      status: 'draft',
      last_saved_at: now,
      created_by: viewer.id,
      updated_by: viewer.id,
    })
    .select('id, last_saved_at')
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/patients/${parsed.data.patient_id}`);
  return {
    success: 'Borrador creado.',
    data: {
      id: data.id,
      lastSavedAt: data.last_saved_at,
    },
  };
}

export async function updateSessionDraft(
  input: unknown,
): Promise<ActionState<{ id: string; lastSavedAt: string }>> {
  const parsed = clinicalSessionFormSchema.safeParse(input);

  if (!parsed.success || !parsed.data.id) {
    return {
      error: parsed.success ? 'Falta el identificador de la sesión.' : parsed.error.issues[0]?.message,
    };
  }

  const viewer = await requireViewer();
  const supabase = await createServerClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('clinical_sessions')
    .update({
      ...parsed.data,
      status: parsed.data.status === 'completed' ? 'completed' : 'draft',
      last_saved_at: now,
      updated_by: viewer.id,
    })
    .eq('id', parsed.data.id)
    .select('id, last_saved_at')
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/patients/${parsed.data.patient_id}`);
  revalidatePath(`/patients/${parsed.data.patient_id}/sessions/${parsed.data.id}`);
  return {
    success: 'Borrador guardado.',
    data: {
      id: data.id,
      lastSavedAt: data.last_saved_at,
    },
  };
}

export async function completeSession(
  input: unknown,
): Promise<ActionState<{ id: string; lastSavedAt: string }>> {
  const parsed = clinicalSessionFormSchema.safeParse(input);

  if (!parsed.success || !parsed.data.id) {
    return {
      error: parsed.success ? 'Falta el identificador de la sesión.' : parsed.error.issues[0]?.message,
    };
  }

  return updateSessionDraft({
    ...parsed.data,
    status: 'completed',
  });
}
