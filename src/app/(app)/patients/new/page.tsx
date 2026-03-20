import { PageShell } from '@/components/shared/page-shell';
import { requireViewer } from '@/lib/auth';
import { listAdminUsers } from '@/modules/users/queries';
import { PatientForm } from '@/modules/patients/components/patient-form';

export default async function NewPatientPage() {
  const viewer = await requireViewer();
  
  // Solo los superadmins pueden asignar el paciente a otras profesionales
  const owners = viewer.role === 'superadmin' ? await listAdminUsers() : [];

  return (
    <PageShell
      title="Nuevo paciente"
      description="Creá una nueva ficha clínica completando los datos iniciales."
    >
      <PatientForm
        viewer={viewer}
        owners={owners.map((owner) => ({
          id: owner.id,
          label: `${owner.name} ${owner.lastname} · ${owner.role}`,
        }))}
      />
    </PageShell>
  );
}