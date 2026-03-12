import type { Viewer } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import {
  mapClinicalSessionDetail,
  mapClinicalSessionListItem,
} from '@/modules/clinical-sessions/mappers';

const sessionSelect = `
  id,
  patient_id,
  date,
  consultation_reason,
  closed_comedones,
  open_comedones,
  papules,
  pustules,
  nodules,
  tubercles,
  scars,
  excoriations,
  milium_cysts,
  sebaceous_cysts,
  macules,
  diagnosis,
  goals,
  cleaning,
  return_to_eudermia,
  exfoliation,
  asepsis,
  extractions,
  pa,
  massages,
  mask,
  final_product,
  sunscreen,
  applied_apparatus,
  home_care_day,
  home_care_night,
  status,
  last_saved_at,
  created_by,
  updated_by,
  created_at,
  updated_at,
  archived_at
`;

export async function listClinicalSessionsForPatient(patientId: string, viewer: Viewer) {
  const supabase = await createServerClient();
  let builder = supabase
    .from('clinical_sessions')
    .select(`${sessionSelect}, patients!inner(admin_user_id)`)
    .eq('patient_id', patientId)
    .is('archived_at', null)
    .order('date', { ascending: false });

  if (viewer.role !== 'superadmin') {
    builder = builder.eq('patients.admin_user_id', viewer.id);
  }

  const { data, error } = await builder;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapClinicalSessionListItem(row));
}

export async function getClinicalSessionDetail(
  patientId: string,
  sessionId: string,
  viewer: Viewer,
) {
  const supabase = await createServerClient();
  let builder = supabase
    .from('clinical_sessions')
    .select(`${sessionSelect}, patients!inner(admin_user_id)`)
    .eq('id', sessionId)
    .eq('patient_id', patientId)
    .is('archived_at', null);

  if (viewer.role !== 'superadmin') {
    builder = builder.eq('patients.admin_user_id', viewer.id);
  }

  const { data, error } = await builder.single();

  if (error || !data) {
    return null;
  }

  return mapClinicalSessionDetail(data);
}
