'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
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
  const inputFields = useMemo(() => {
    type PatientTextField = (typeof patientTextFields)[number];
    const byKey = new Map<PatientTextField['key'], PatientTextField>(
      patientTextFields.map((field) => [field.key, field]),
    );
    const isField = (value: PatientTextField | undefined): value is PatientTextField =>
      Boolean(value);
    const pick = (keys: PatientTextField['key'][]) =>
      keys.map((key) => byKey.get(key)).filter(isField);

    return {
      datos: pick([
        'name',
        'born_date',
        'nationality',
        'marital_status',
        'number_of_children',
        'occupation',
        'working_hours',
        'first_consultation_date',
      ]),
      contacto: pick([
        'email',
        'phone',
        'instagram_account',
        'street',
        'street_number',
        'location',
        'person_for_contact',
      ]),
      cobertura: pick(['healthcare_plan', 'healthcare_plan_number']),
    } as const;
  }, []);

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
              className="h-11 w-full rounded-full border border-stone-300 bg-white px-5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
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

        <Tabs.Root defaultValue="datos" className="space-y-4">
          <Tabs.List className="flex flex-wrap gap-2 rounded-full bg-white/60 p-2 shadow-sm">
            {[
              ['datos', 'Datos'],
              ['contacto', 'Contacto'],
              ['cobertura', 'Cobertura'],
              ['habitos', 'Hábitos'],
              ['antecedentes', 'Antecedentes'],
              ['tratamientos', 'Tratamientos'],
            ].map(([value, label]) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-stone-600 transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm hover:text-stone-900"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="datos">
            <div className="grid gap-4 md:grid-cols-2">
              {inputFields.datos.map((field) => (
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
          </Tabs.Content>

          <Tabs.Content value="contacto">
            <div className="grid gap-4 md:grid-cols-2">
              {inputFields.contacto.map((field) => (
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
          </Tabs.Content>

          <Tabs.Content value="cobertura">
            <div className="grid gap-4 md:grid-cols-2">
              {inputFields.cobertura.map((field) => (
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
          </Tabs.Content>

          <Tabs.Content value="habitos">
            <div className="grid gap-2 sm:gap-3 lg:grid-cols-2">
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

              <label className="rounded-2xl bg-white/35 px-4 py-3 text-sm text-stone-700 transition hover:bg-white/55 hover:text-stone-900">
                <span className="mb-2 block text-sm font-medium text-stone-600">
                  Antecedente gastrointestinal
                </span>
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
          </Tabs.Content>

          <Tabs.Content value="antecedentes">
            <div className="grid gap-4">
              {patientLongTextFields
                .filter((field) =>
                  [
                    'hereditary_history',
                    'allergic_history',
                    'organic_history',
                    'other_medical_history',
                  ].includes(field.key),
                )
                .map((field) => (
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
          </Tabs.Content>

          <Tabs.Content value="tratamientos">
            <div className="grid gap-4">
              {patientLongTextFields
                .filter((field) =>
                  [
                    'medication',
                    'cosmetics_used',
                    'previous_and_current_treatments',
                    'current_home_treatment',
                    'diet',
                    'modifications_or_suggestions',
                  ].includes(field.key),
                )
                .map((field) => (
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
          </Tabs.Content>
        </Tabs.Root>

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
