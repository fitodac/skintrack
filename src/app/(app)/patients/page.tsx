import Link from 'next/link';
import { PageShell } from '@/components/shared/page-shell';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { requireViewer } from '@/lib/auth';
import { listPatientsForViewer } from '@/modules/patients/queries';
import { PatientForm } from '@/modules/patients/components/patient-form';
import { listAdminUsers } from '@/modules/users/queries';

type PatientsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const viewer = await requireViewer();
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const page =
    typeof params.page === 'string' && Number.isFinite(Number(params.page))
      ? Number(params.page)
      : 1;

  const [{ items, total, pageSize }, owners] = await Promise.all([
    listPatientsForViewer(viewer, query, page),
    viewer.role === 'superadmin' ? listAdminUsers() : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <PageShell
      title="Pacientes"
      description="Buscá, registrá y administrá las fichas clínicas de la cartera activa."
      actions={
        <div className="rounded-full bg-white/90 px-4 py-2 text-sm text-stone-600 shadow-sm">
          {total} pacientes cargadas
        </div>
      }
    >
      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col gap-3 md:flex-row">
            <Input
              name="q"
              placeholder="Buscar por nombre, email o teléfono"
              defaultValue={query}
              className="md:flex-1"
            />
            <Button type="submit">Buscar</Button>
          </form>
        </CardContent>
      </Card>

      <PatientForm
        viewer={viewer}
        owners={owners.map((owner) => ({
          id: owner.id,
          label: `${owner.name} ${owner.lastname} · ${owner.role}`,
        }))}
      />

      {items.length === 0 ? (
        <EmptyState
          title="Todavía no hay pacientes"
          description="Cuando registres la primera ficha clínica, aparecerá en este listado."
        />
      ) : (
        <div className="grid gap-4">
          {items.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <Card className="transition hover:-translate-y-0.5 hover:border-stone-950">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-stone-950">{patient.name}</h2>
                    <p className="text-sm text-stone-500">
                      {patient.email}
                      {patient.phone ? ` · ${patient.phone}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {patient.location ? <Badge>{patient.location}</Badge> : null}
                    {patient.firstConsultationDate ? (
                      <Badge variant="success">Desde {patient.firstConsultationDate}</Badge>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between rounded-[28px] bg-white px-6 py-4 shadow-sm">
          <p className="text-sm text-stone-500">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/patients?page=${Math.max(1, page - 1)}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm"
            >
              Anterior
            </Link>
            <Link
              href={`/patients?page=${Math.min(totalPages, page + 1)}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm"
            >
              Siguiente
            </Link>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
