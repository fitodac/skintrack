'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createPatient, updatePatient } from '@/lib/actions/patients-actions';
import type { Viewer } from '@/lib/auth';
import {
  patientBooleanFields,
  patientLongTextFields,
  patientTextFields,
  type PatientDetailDTO,
} from '@/modules/patients/types';

type OwnerOption = {
  id: string;
  label: string;
};

interface PatientFormProps {
  viewer: Viewer;
  patient?: PatientDetailDTO | null;
  owners?: OwnerOption[];
}

function buildInitialState(patient?: PatientDetailDTO | null) {
  return {
    id: patient?.id,
    admin_user_id: patient?.adminUserId ?? null,
    name: patient?.name ?? '',
    email: patient?.email ?? '',
    born_date: patient?.bornDate ?? '',
    nationality: patient?.nationality ?? '',
    marital_status: patient?.maritalStatus ?? '',
    number_of_children: patient?.numberOfChildren?.toString() ?? '',
    street: patient?.street ?? '',
    street_number: patient?.streetNumber ?? '',
    location: patient?.location ?? '',
    phone: patient?.phone ?? '',
    instagram_account: patient?.instagramAccount ?? '',
    healthcare_plan: patient?.healthcarePlan ?? '',
    healthcare_plan_number: patient?.healthcarePlanNumber ?? '',
    person_for_contact: patient?.personForContact ?? '',
    occupation: patient?.occupation ?? '',
    working_hours: patient?.workingHours ?? '',
    first_consultation_date: patient?.firstConsultationDate ?? '',
    hereditary_history: patient?.hereditaryHistory ?? '',
    allergic_history: patient?.allergicHistory ?? '',
    organic_history: patient?.organicHistory ?? '',
    thyroid: patient?.thyroid ?? false,
    weight_loss: patient?.weightLoss ?? false,
    hypertrichosis: patient?.hypertrichosis ?? false,
    hirsutism: patient?.hirsutism ?? false,
    obesity: patient?.obesity ?? false,
    gastrointestinal_history: patient?.gastrointestinalHistory ?? null,
    pregnancy: patient?.pregnancy ?? false,
    medication: patient?.medication ?? '',
    alcohol: patient?.alcohol ?? false,
    drugs: patient?.drugs ?? false,
    smoke: patient?.smoke ?? false,
    other_medical_history: patient?.otherMedicalHistory ?? '',
    cosmetics_used: patient?.cosmeticsUsed ?? '',
    previous_and_current_treatments: patient?.previousAndCurrentTreatments ?? '',
    current_home_treatment: patient?.currentHomeTreatment ?? '',
    diet: patient?.diet ?? '',
    modifications_or_suggestions: patient?.modificationsOrSuggestions ?? '',
  };
}

export function PatientForm({ viewer, patient, owners = [] }: PatientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [values, setValues] = useState(buildInitialState(patient));

  const submitLabel = patient ? 'Guardar cambios' : 'Crear paciente';
  const ownerOptions = useMemo(() => owners, [owners]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{patient ? 'Editar paciente' : 'Nuevo paciente'}</CardTitle>
        <CardDescription>
          Ficha clínica principal, antecedentes y hábitos relevantes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {viewer.role === 'superadmin' ? (
          <div className="space-y-2">
            <Label htmlFor="admin_user_id">Profesional asignada</Label>
            <select
              id="admin_user_id"
              className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm"
              value={values.admin_user_id ?? ''}
              onChange={(event) =>
                setValues((current) => ({ ...current, admin_user_id: event.target.value }))
              }
            >
              <option value="">Asignar luego</option>
              {ownerOptions.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {patientTextFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type}
                value={values[field.key as keyof typeof values] as string}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {patientBooleanFields.map((field) => (
            <Checkbox
              key={field.key}
              label={field.label}
              checked={Boolean(values[field.key as keyof typeof values])}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field.key]: event.target.checked,
                }))
              }
            />
          ))}

          <label className="rounded-2xl border border-stone-200 px-4 py-3">
            <span className="mb-2 block text-sm text-stone-700">Antecedente gastrointestinal</span>
            <select
              className="w-full bg-transparent text-sm outline-none"
              value={
                values.gastrointestinal_history === null
                  ? 'unknown'
                  : values.gastrointestinal_history
                    ? 'yes'
                    : 'no'
              }
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  gastrointestinal_history:
                    event.target.value === 'unknown' ? null : event.target.value === 'yes',
                }))
              }
            >
              <option value="unknown">Sin dato</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4">
          {patientLongTextFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Textarea
                id={field.key}
                value={values[field.key as keyof typeof values] as string}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>

        {message ? <p className="text-sm text-stone-600">{message}</p> : null}

        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const payload = {
                ...values,
                number_of_children:
                  values.number_of_children === '' ? null : Number(values.number_of_children),
              };
              const result = patient
                ? await updatePatient(payload)
                : await createPatient(payload);

              if (result.error) {
                setMessage(result.error);
                return;
              }

              setMessage(result.success ?? 'Paciente guardado.');

              if (!patient && result.data?.id) {
                router.push(`/patients/${result.data.id}`);
              } else {
                router.refresh();
              }
            });
          }}
        >
          {isPending ? 'Guardando...' : submitLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
