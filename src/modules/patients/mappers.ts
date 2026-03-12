import type { PatientDetailDTO, PatientListItemDTO, PatientRow } from '@/modules/patients/types';

export function mapPatientListItem(row: PatientRow): PatientListItemDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    firstConsultationDate: row.first_consultation_date,
    adminUserId: row.admin_user_id,
  };
}

export function mapPatientDetail(row: PatientRow): PatientDetailDTO {
  return {
    ...mapPatientListItem(row),
    bornDate: row.born_date,
    nationality: row.nationality,
    maritalStatus: row.marital_status,
    numberOfChildren: row.number_of_children,
    street: row.street,
    streetNumber: row.street_number,
    instagramAccount: row.instagram_account,
    healthcarePlan: row.healthcare_plan,
    healthcarePlanNumber: row.healthcare_plan_number,
    personForContact: row.person_for_contact,
    occupation: row.occupation,
    workingHours: row.working_hours,
    hereditaryHistory: row.hereditary_history,
    allergicHistory: row.allergic_history,
    organicHistory: row.organic_history,
    thyroid: row.thyroid,
    weightLoss: row.weight_loss,
    hypertrichosis: row.hypertrichosis,
    hirsutism: row.hirsutism,
    obesity: row.obesity,
    gastrointestinalHistory: row.gastrointestinal_history,
    pregnancy: row.pregnancy,
    medication: row.medication,
    alcohol: row.alcohol,
    drugs: row.drugs,
    smoke: row.smoke,
    otherMedicalHistory: row.other_medical_history,
    cosmeticsUsed: row.cosmetics_used,
    previousAndCurrentTreatments: row.previous_and_current_treatments,
    currentHomeTreatment: row.current_home_treatment,
    diet: row.diet,
    modificationsOrSuggestions: row.modifications_or_suggestions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
