import { notFound } from 'next/navigation';
import { PageShell } from '@/components/shared/page-shell';
import { requireViewer } from '@/lib/auth';
import { ClinicalSessionEditor } from '@/modules/clinical-sessions/components/clinical-session-editor';
import { getPatientDetailForViewer } from '@/modules/patients/queries';

type NewSessionPageProps = {
  params: Promise<{
    patientId: string;
  }>;
};

export default async function NewSessionPage({ params }: NewSessionPageProps) {
  const viewer = await requireViewer();
  const { patientId } = await params;
  const patient = await getPatientDetailForViewer(patientId, viewer);

  if (!patient) {
    notFound();
  }

  return (
    <PageShell
      title={`Nueva sesión · ${patient.name}`}
      description="El borrador se crea en el primer cambio y queda guardado automáticamente."
    >
      <ClinicalSessionEditor patientId={patientId} />
    </PageShell>
  );
}
