import { PAGE_SIZE } from '@/lib/constants';
import type { Viewer } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { mapPatientDetail, mapPatientListItem } from '@/modules/patients/mappers';
import { normalizeSearchQuery } from '@/modules/patients/helpers';

const patientSelect = `
  id,
  admin_user_id,
  name,
  born_date,
  nationality,
  marital_status,
  number_of_children,
  street,
  street_number,
  location,
  email,
  phone,
  instagram_account,
  healthcare_plan,
  healthcare_plan_number,
  person_for_contact,
  occupation,
  working_hours,
  first_consultation_date,
  hereditary_history,
  allergic_history,
  organic_history,
  thyroid,
  weight_loss,
  hypertrichosis,
  hirsutism,
  obesity,
  gastrointestinal_history,
  pregnancy,
  medication,
  alcohol,
  drugs,
  smoke,
  other_medical_history,
  cosmetics_used,
  previous_and_current_treatments,
  current_home_treatment,
  diet,
  modifications_or_suggestions,
  created_by,
  updated_by,
  created_at,
  updated_at,
  archived_at
`;

export async function listPatientsForViewer(viewer: Viewer, query?: string, page = 1) {
  const supabase = await createServerClient();
  const normalizedQuery = normalizeSearchQuery(query);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let builder = supabase
    .from('patients')
    .select(patientSelect, { count: 'exact' })
    .is('archived_at', null)
    .order('updated_at', { ascending: false })
    .range(from, to);

  if (viewer.role !== 'superadmin') {
    builder = builder.eq('admin_user_id', viewer.id);
  }

  if (normalizedQuery) {
    builder = builder.or(
      `name.ilike.%${normalizedQuery}%,email.ilike.%${normalizedQuery}%,phone.ilike.%${normalizedQuery}%`,
    );
  }

  const { data, count, error } = await builder;

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data ?? []).map(mapPatientListItem),
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getPatientDetailForViewer(patientId: string, viewer: Viewer) {
  const supabase = await createServerClient();
  let builder = supabase
    .from('patients')
    .select(patientSelect)
    .eq('id', patientId)
    .is('archived_at', null);

  if (viewer.role !== 'superadmin') {
    builder = builder.eq('admin_user_id', viewer.id);
  }

  const { data, error } = await builder.single();

  if (error || !data) {
    return null;
  }

  return mapPatientDetail(data);
}
