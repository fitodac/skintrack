'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  completeSession,
  createSessionDraft,
  updateSessionDraft,
} from '@/lib/actions/clinical-session-actions';
import { formatDateTime } from '@/lib/utils';
import { hasClinicalSessionContent } from '@/modules/clinical-sessions/helpers';
import { sessionBooleanFields, sessionLongTextFields } from '@/modules/clinical-sessions/types';
import type { ClinicalSessionDetailDTO } from '@/modules/clinical-sessions/types';

interface ClinicalSessionEditorProps {
  patientId: string;
  session?: ClinicalSessionDetailDTO | null;
}

function buildInitialValues(patientId: string, session?: ClinicalSessionDetailDTO | null) {
  return {
    id: session?.id,
    patient_id: patientId,
    date: session?.date ?? new Date().toISOString().slice(0, 10),
    consultation_reason: session?.consultationReason ?? '',
    closed_comedones: session?.findings.closed_comedones ?? false,
    open_comedones: session?.findings.open_comedones ?? false,
    papules: session?.findings.papules ?? false,
    pustules: session?.findings.pustules ?? false,
    nodules: session?.findings.nodules ?? false,
    tubercles: session?.findings.tubercles ?? false,
    scars: session?.findings.scars ?? false,
    excoriations: session?.findings.excoriations ?? false,
    milium_cysts: session?.findings.milium_cysts ?? false,
    sebaceous_cysts: session?.findings.sebaceous_cysts ?? false,
    macules: session?.findings.macules ?? false,
    diagnosis: session?.diagnosis ?? '',
    goals: session?.goals ?? '',
    cleaning: session?.cleaning ?? '',
    return_to_eudermia: session?.returnToEudermia ?? '',
    exfoliation: session?.exfoliation ?? '',
    asepsis: session?.asepsis ?? '',
    extractions: session?.extractions ?? '',
    pa: session?.pa ?? '',
    massages: session?.massages ?? '',
    mask: session?.mask ?? '',
    final_product: session?.finalProduct ?? '',
    sunscreen: session?.sunscreen ?? '',
    applied_apparatus: session?.appliedApparatus ?? '',
    home_care_day: session?.homeCareDay ?? '',
    home_care_night: session?.homeCareNight ?? '',
    status: session?.status ?? 'draft',
  } as const;
}

export function ClinicalSessionEditor({ patientId, session }: ClinicalSessionEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState(buildInitialValues(patientId, session));
  const [sessionId, setSessionId] = useState(session?.id ?? null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(session?.lastSavedAt ?? null);
  const [isPending, startTransition] = useTransition();
  const skipFirstEffect = useRef(true);

  useEffect(() => {
    if (skipFirstEffect.current) {
      skipFirstEffect.current = false;
      return;
    }

    if (!hasClinicalSessionContent(values)) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(async () => {
        if (!sessionId) {
          const result = await createSessionDraft(values);

          if (result.error) {
            setStatusMessage(result.error);
            return;
          }

          setSessionId(result.data?.id ?? null);
          setLastSavedAt(result.data?.lastSavedAt ?? null);
          setStatusMessage('Borrador guardado.');

          if (result.data?.id) {
            router.replace(`/patients/${patientId}/sessions/${result.data.id}`);
          }

          return;
        }

        const result = await updateSessionDraft({
          ...values,
          id: sessionId,
        });

        if (result.error) {
          setStatusMessage(result.error);
          return;
        }

        setLastSavedAt(result.data?.lastSavedAt ?? null);
        setStatusMessage('Guardado automático.');
      });
    }, 800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [patientId, router, sessionId, values]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{session ? 'Editar sesión clínica' : 'Nueva sesión clínica'}</CardTitle>
            <CardDescription>
              El borrador se crea en el primer cambio válido y luego se guarda automáticamente.
            </CardDescription>
          </div>
          <Badge variant={values.status === 'completed' ? 'success' : 'warning'}>
            {values.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            type="date"
            value={values.date}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                date: event.target.value,
              }))
            }
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sessionBooleanFields.map((field) => (
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
        </div>

        <div className="grid gap-4">
          {sessionLongTextFields.map((field) => (
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

        <div className="flex flex-wrap items-center gap-4">
          <Button
            disabled={isPending || !sessionId}
            onClick={() => {
              if (!sessionId) {
                setStatusMessage('Esperá a que se cree el borrador antes de completar la sesión.');
                return;
              }

              startTransition(async () => {
                const result = await completeSession({
                  ...values,
                  id: sessionId,
                  status: 'completed',
                });

                if (result.error) {
                  setStatusMessage(result.error);
                  return;
                }

                setValues((current) => ({ ...current, status: 'completed' }));
                setLastSavedAt(result.data?.lastSavedAt ?? null);
                setStatusMessage('Sesión marcada como completada.');
                router.refresh();
              });
            }}
          >
            {isPending ? 'Guardando...' : 'Marcar como completada'}
          </Button>

          <div className="text-sm text-stone-500">
            {statusMessage ? <p>{statusMessage}</p> : null}
            {lastSavedAt ? <p>Último guardado: {formatDateTime(lastSavedAt)}</p> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
