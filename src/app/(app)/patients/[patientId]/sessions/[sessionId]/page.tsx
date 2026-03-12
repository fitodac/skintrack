import { notFound } from 'next/navigation';
import { PageShell } from '@/components/shared/page-shell';
import { requireViewer } from '@/lib/auth';
import { ClinicalSessionEditor } from '@/modules/clinical-sessions/components/clinical-session-editor';
import { getClinicalSessionDetail } from '@/modules/clinical-sessions/queries';
import { getPatientDetailForViewer } from '@/modules/patients/queries';

type SessionDetailPageProps = {
  params: Promise<{
    patientId: string;
    sessionId: string;
  }>;
};

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const viewer = await requireViewer();
  const { patientId, sessionId } = await params;
  const [patient, session] = await Promise.all([
    getPatientDetailForViewer(patientId, viewer),
    getClinicalSessionDetail(patientId, sessionId, viewer),
  ]);

  if (!patient || !session) {
    notFound();
  }

  return (
    <PageShell
      title={`Sesión de ${patient.name}`}
      description="Editá el seguimiento clínico y completá la sesión cuando el registro esté listo."
    >
      <ClinicalSessionEditor patientId={patientId} session={session} />
    </PageShell>
  );
}
