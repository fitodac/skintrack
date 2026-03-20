import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageShell } from '@/components/shared/page-shell';
import { Button } from '@/components/ui/button';
import { requireViewer } from '@/lib/auth';
import { listAdminUsers } from '@/modules/users/queries';
import { listClinicalSessionsForPatient } from '@/modules/clinical-sessions/queries';
import { ClinicalSessionsTable } from '@/modules/clinical-sessions/components/clinical-sessions-table';
import { PatientForm } from '@/modules/patients/components/patient-form';
import { getPatientDetailForViewer } from '@/modules/patients/queries';

type PatientDetailPageProps = {
  params: Promise<{
    patientId: string;
  }>;
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const viewer = await requireViewer();
  const { patientId } = await params;
  const [patient, sessions, owners] = await Promise.all([
    getPatientDetailForViewer(patientId, viewer),
    listClinicalSessionsForPatient(patientId, viewer),
    viewer.role === 'superadmin' ? listAdminUsers() : Promise.resolve([]),
  ]);

  if (!patient) {
    notFound();
  }

  return (
    <PageShell
      title={patient.name}
      description="Detalle clínico completo con edición de ficha y seguimiento por sesiones."
      actions={
        <Link href={`/patients/${patient.id}/sessions/new`}>
          <Button>Nueva sesión</Button>
        </Link>
      }
    >
      <ClinicalSessionsTable patientId={patient.id} sessions={sessions} />
      <PatientForm
        viewer={viewer}
        patient={patient}
        owners={owners.map((owner) => ({
          id: owner.id,
          label: `${owner.name} ${owner.lastname} · ${owner.role}`,
        }))}
      />
    </PageShell>
  );
}
