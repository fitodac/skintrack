import { describe, expect, it } from 'vitest';
import { mapPatientDetail } from '@/modules/patients/mappers';
import type { Database } from '@/types/supabase';

type PatientRow = Database['public']['Tables']['patients']['Row'];

describe('mapPatientDetail', () => {
  it('maps snake_case database fields to DTO fields', () => {
    const row: PatientRow = {
      id: crypto.randomUUID(),
      admin_user_id: crypto.randomUUID(),
      name: 'Ana Pérez',
      born_date: '1990-04-10',
      nationality: 'Argentina',
      marital_status: 'Soltera',
      number_of_children: 0,
      street: 'Siempre Viva',
      street_number: '123',
      location: 'Rosario',
      email: 'ana@example.com',
      phone: '123456',
      instagram_account: '@ana',
      healthcare_plan: 'OSDE',
      healthcare_plan_number: '555',
      person_for_contact: 'Mamá',
      occupation: 'Docente',
      working_hours: 'Mañana',
      first_consultation_date: '2026-03-10',
      hereditary_history: null,
      allergic_history: null,
      organic_history: null,
      thyroid: false,
      weight_loss: false,
      hypertrichosis: false,
      hirsutism: false,
      obesity: false,
      gastrointestinal_history: null,
      pregnancy: false,
      medication: null,
      alcohol: false,
      drugs: false,
      smoke: false,
      other_medical_history: null,
      cosmetics_used: null,
      previous_and_current_treatments: null,
      current_home_treatment: null,
      diet: null,
      modifications_or_suggestions: null,
      created_by: crypto.randomUUID(),
      updated_by: crypto.randomUUID(),
      created_at: '2026-03-10T10:00:00.000Z',
      updated_at: '2026-03-10T10:00:00.000Z',
      archived_at: null,
    };

    const dto = mapPatientDetail(row);
    expect(dto.adminUserId).toBe(row.admin_user_id);
    expect(dto.firstConsultationDate).toBe(row.first_consultation_date);
    expect(dto.previousAndCurrentTreatments).toBe(row.previous_and_current_treatments);
  });
});
