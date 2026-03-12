import type {
  ClinicalSessionDetailDTO,
  ClinicalSessionListItemDTO,
  ClinicalSessionRow,
} from '@/modules/clinical-sessions/types';

export function mapClinicalSessionListItem(
  row: ClinicalSessionRow,
): ClinicalSessionListItemDTO {
  return {
    id: row.id,
    date: row.date,
    status: row.status,
    diagnosis: row.diagnosis,
    updatedAt: row.updated_at,
  };
}

export function mapClinicalSessionDetail(
  row: ClinicalSessionRow,
): ClinicalSessionDetailDTO {
  return {
    ...mapClinicalSessionListItem(row),
    patientId: row.patient_id,
    consultationReason: row.consultation_reason,
    findings: {
      closed_comedones: row.closed_comedones,
      open_comedones: row.open_comedones,
      papules: row.papules,
      pustules: row.pustules,
      nodules: row.nodules,
      tubercles: row.tubercles,
      scars: row.scars,
      excoriations: row.excoriations,
      milium_cysts: row.milium_cysts,
      sebaceous_cysts: row.sebaceous_cysts,
      macules: row.macules,
    },
    diagnosis: row.diagnosis,
    goals: row.goals,
    cleaning: row.cleaning,
    returnToEudermia: row.return_to_eudermia,
    exfoliation: row.exfoliation,
    asepsis: row.asepsis,
    extractions: row.extractions,
    pa: row.pa,
    massages: row.massages,
    mask: row.mask,
    finalProduct: row.final_product,
    sunscreen: row.sunscreen,
    appliedApparatus: row.applied_apparatus,
    homeCareDay: row.home_care_day,
    homeCareNight: row.home_care_night,
    lastSavedAt: row.last_saved_at,
  };
}
