'use client';

import * as Tabs from '@radix-ui/react-tabs';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { PatientDetailDTO } from '@/modules/patients/types';
import type { ClinicalSessionListItemDTO } from '@/modules/clinical-sessions/types';

interface PatientDetailTabsProps {
  patient: PatientDetailDTO;
  sessions: ClinicalSessionListItemDTO[];
}

function Item({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="text-sm text-stone-800">{value || 'Sin dato'}</p>
    </div>
  );
}

export function PatientDetailTabs({ patient, sessions }: PatientDetailTabsProps) {
  return (
    <Tabs.Root defaultValue="personales" className="space-y-4">
      <Tabs.List className="flex flex-wrap gap-2 rounded-[28px] bg-white p-2 shadow-sm">
        {[
          ['personales', 'Datos personales'],
          ['antecedentes', 'Antecedentes'],
          ['habitos', 'Hábitos y tratamientos'],
          ['sesiones', 'Sesiones clínicas'],
        ].map(([value, label]) => (
          <Tabs.Trigger
            key={value}
            value={value}
            className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 data-[state=active]:bg-stone-950 data-[state=active]:text-white"
          >
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="personales">
        <Card>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-2 xl:grid-cols-3">
            <Item label="Nombre" value={patient.name} />
            <Item label="Email" value={patient.email} />
            <Item label="Teléfono" value={patient.phone} />
            <Item label="Nacimiento" value={formatDate(patient.bornDate)} />
            <Item label="Nacionalidad" value={patient.nationality} />
            <Item label="Estado civil" value={patient.maritalStatus} />
            <Item label="Hijos" value={patient.numberOfChildren} />
            <Item label="Dirección" value={`${patient.street ?? ''} ${patient.streetNumber ?? ''}`} />
            <Item label="Localidad" value={patient.location} />
            <Item label="Instagram" value={patient.instagramAccount} />
            <Item label="Obra social" value={patient.healthcarePlan} />
            <Item label="Afiliada" value={patient.healthcarePlanNumber} />
          </CardContent>
        </Card>
      </Tabs.Content>

      <Tabs.Content value="antecedentes">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Item label="Hereditarios" value={patient.hereditaryHistory} />
            <Separator />
            <Item label="Alérgicos" value={patient.allergicHistory} />
            <Separator />
            <Item label="Orgánicos" value={patient.organicHistory} />
            <Separator />
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Tiroides', active: patient.thyroid },
                { label: 'Descenso de peso', active: patient.weightLoss },
                { label: 'Hipertricosis', active: patient.hypertrichosis },
                { label: 'Hirsutismo', active: patient.hirsutism },
                { label: 'Obesidad', active: patient.obesity },
                { label: 'Embarazo', active: patient.pregnancy },
              ].map(({ label, active }) => (
                <Badge key={label} variant={active ? 'warning' : 'neutral'}>
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Tabs.Content>

      <Tabs.Content value="habitos">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Item label="Medicación" value={patient.medication} />
            <Item label="Cosméticos usados" value={patient.cosmeticsUsed} />
            <Item label="Tratamientos previos/actuales" value={patient.previousAndCurrentTreatments} />
            <Item label="Tratamiento domiciliario" value={patient.currentHomeTreatment} />
            <Item label="Dieta" value={patient.diet} />
            <Item label="Sugerencias" value={patient.modificationsOrSuggestions} />
          </CardContent>
        </Card>
      </Tabs.Content>

      <Tabs.Content value="sesiones">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-950">Historial clínico</h3>
                <p className="text-sm text-stone-500">Ordenado por fecha descendente.</p>
              </div>
              <Link
                href={`/patients/${patient.id}/sessions/new`}
                className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Registrar sesión
              </Link>
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/patients/${patient.id}/sessions/${session.id}`}
                  className="block rounded-2xl border border-stone-200 p-4 transition hover:border-stone-950"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-stone-900">{formatDate(session.date)}</p>
                      <p className="text-sm text-stone-500">{session.diagnosis || 'Sin diagnóstico cargado'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                        {session.status}
                      </Badge>
                      <p className="mt-2 text-xs text-stone-500">
                        Actualizada {formatDateTime(session.updatedAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {sessions.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-stone-200 p-4 text-sm text-stone-500">
                  Todavía no hay sesiones registradas para esta paciente.
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Tabs.Content>
    </Tabs.Root>
  );
}
