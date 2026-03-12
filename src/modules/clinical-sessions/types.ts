import type { Database } from '@/types/supabase';

export type ClinicalSessionRow = Database['public']['Tables']['clinical_sessions']['Row'];

export interface ClinicalSessionListItemDTO {
  id: string;
  date: string;
  status: Database['public']['Enums']['session_status'];
  diagnosis: string | null;
  updatedAt: string;
}

export interface ClinicalSessionDetailDTO extends ClinicalSessionListItemDTO {
  patientId: string;
  consultationReason: string | null;
  findings: Record<string, boolean>;
  diagnosis: string | null;
  goals: string | null;
  cleaning: string | null;
  returnToEudermia: string | null;
  exfoliation: string | null;
  asepsis: string | null;
  extractions: string | null;
  pa: string | null;
  massages: string | null;
  mask: string | null;
  finalProduct: string | null;
  sunscreen: string | null;
  appliedApparatus: string | null;
  homeCareDay: string | null;
  homeCareNight: string | null;
  lastSavedAt: string;
}

export const sessionBooleanFields = [
  { key: 'closed_comedones', label: 'Comedones cerrados' },
  { key: 'open_comedones', label: 'Comedones abiertos' },
  { key: 'papules', label: 'Pápulas' },
  { key: 'pustules', label: 'Pústulas' },
  { key: 'nodules', label: 'Nódulos' },
  { key: 'tubercles', label: 'Tubérculos' },
  { key: 'scars', label: 'Cicatrices' },
  { key: 'excoriations', label: 'Excoriaciones' },
  { key: 'milium_cysts', label: 'Quistes de milium' },
  { key: 'sebaceous_cysts', label: 'Quistes sebáceos' },
  { key: 'macules', label: 'Máculas' },
];

export const sessionLongTextFields = [
  { key: 'consultation_reason', label: 'Motivo de consulta' },
  { key: 'diagnosis', label: 'Diagnóstico' },
  { key: 'goals', label: 'Objetivos' },
  { key: 'cleaning', label: 'Limpieza' },
  { key: 'return_to_eudermia', label: 'Retorno a eudermia' },
  { key: 'exfoliation', label: 'Exfoliación' },
  { key: 'asepsis', label: 'Asepsia' },
  { key: 'extractions', label: 'Extracciones' },
  { key: 'pa', label: 'P/A' },
  { key: 'massages', label: 'Masajes' },
  { key: 'mask', label: 'Máscara' },
  { key: 'final_product', label: 'Producto final' },
  { key: 'sunscreen', label: 'Protector solar' },
  { key: 'applied_apparatus', label: 'Aparatología aplicada' },
  { key: 'home_care_day', label: 'Home care día' },
  { key: 'home_care_night', label: 'Home care noche' },
];
