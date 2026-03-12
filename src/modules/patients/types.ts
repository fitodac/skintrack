import type { Database } from '@/types/supabase';

export type PatientRow = Database['public']['Tables']['patients']['Row'];

export interface PatientListItemDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  firstConsultationDate: string | null;
  adminUserId: string;
}

export interface PatientDetailDTO extends PatientListItemDTO {
  bornDate: string | null;
  nationality: string | null;
  maritalStatus: string | null;
  numberOfChildren: number | null;
  street: string | null;
  streetNumber: string | null;
  instagramAccount: string | null;
  healthcarePlan: string | null;
  healthcarePlanNumber: string | null;
  personForContact: string | null;
  occupation: string | null;
  workingHours: string | null;
  hereditaryHistory: string | null;
  allergicHistory: string | null;
  organicHistory: string | null;
  thyroid: boolean;
  weightLoss: boolean;
  hypertrichosis: boolean;
  hirsutism: boolean;
  obesity: boolean;
  gastrointestinalHistory: boolean | null;
  pregnancy: boolean;
  medication: string | null;
  alcohol: boolean;
  drugs: boolean;
  smoke: boolean;
  otherMedicalHistory: string | null;
  cosmeticsUsed: string | null;
  previousAndCurrentTreatments: string | null;
  currentHomeTreatment: string | null;
  diet: string | null;
  modificationsOrSuggestions: string | null;
  createdAt: string;
  updatedAt: string;
}

export const patientTextFields = [
  { key: 'name', label: 'Nombre completo', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Teléfono', type: 'text' },
  { key: 'born_date', label: 'Fecha de nacimiento', type: 'date' },
  { key: 'nationality', label: 'Nacionalidad', type: 'text' },
  { key: 'marital_status', label: 'Estado civil', type: 'text' },
  { key: 'number_of_children', label: 'Cantidad de hijos', type: 'number' },
  { key: 'street', label: 'Calle', type: 'text' },
  { key: 'street_number', label: 'Número', type: 'text' },
  { key: 'location', label: 'Localidad', type: 'text' },
  { key: 'instagram_account', label: 'Instagram', type: 'text' },
  { key: 'healthcare_plan', label: 'Obra social', type: 'text' },
  { key: 'healthcare_plan_number', label: 'Número de afiliada', type: 'text' },
  { key: 'person_for_contact', label: 'Contacto de emergencia', type: 'text' },
  { key: 'occupation', label: 'Ocupación', type: 'text' },
  { key: 'working_hours', label: 'Horarios laborales', type: 'text' },
  { key: 'first_consultation_date', label: 'Primera consulta', type: 'date' },
];

export const patientLongTextFields = [
  { key: 'hereditary_history', label: 'Antecedentes hereditarios' },
  { key: 'allergic_history', label: 'Antecedentes alérgicos' },
  { key: 'organic_history', label: 'Antecedentes orgánicos' },
  { key: 'medication', label: 'Medicación' },
  { key: 'other_medical_history', label: 'Otros antecedentes médicos' },
  { key: 'cosmetics_used', label: 'Cosméticos usados' },
  { key: 'previous_and_current_treatments', label: 'Tratamientos previos y actuales' },
  { key: 'current_home_treatment', label: 'Tratamiento domiciliario actual' },
  { key: 'diet', label: 'Dieta' },
  { key: 'modifications_or_suggestions', label: 'Modificaciones o sugerencias' },
];

export const patientBooleanFields = [
  { key: 'thyroid', label: 'Tiroides' },
  { key: 'weight_loss', label: 'Descenso de peso' },
  { key: 'hypertrichosis', label: 'Hipertricosis' },
  { key: 'hirsutism', label: 'Hirsutismo' },
  { key: 'obesity', label: 'Obesidad' },
  { key: 'pregnancy', label: 'Embarazo' },
  { key: 'alcohol', label: 'Alcohol' },
  { key: 'drugs', label: 'Drogas' },
  { key: 'smoke', label: 'Fuma' },
];
