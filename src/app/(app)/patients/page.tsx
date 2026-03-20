import Link from 'next/link';
import { PageShell } from '@/components/shared/page-shell';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requireViewer } from '@/lib/auth';
import { listPatientsForViewer } from '@/modules/patients/queries';

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

  const { items, total, pageSize } = await listPatientsForViewer(viewer, query, page);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <PageShell
      title="Pacientes"
      description="Buscá, registrá y administrá las fichas clínicas de la cartera activa."
      actions={
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-stone-500">
            {total} pacientes
          </div>
          <Link href="/patients/new">
            <Button>NUEVO PACIENTE</Button>
          </Link>
        </div>
      }
    >
      <div className="rounded-[32px] bg-white/50 p-3 shadow-sm border border-white/60">
        <form className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            name="q"
            placeholder="Buscar por nombre, email o teléfono..."
            defaultValue={query}
            className="md:flex-1 bg-white/60 border-transparent shadow-inner focus:bg-white"
          />
          <Button type="submit" className="rounded-full px-8">Buscar</Button>
        </form>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Todavía no hay pacientes"
          description="Cuando registres la primera ficha clínica, aparecerá en este listado."
        />
      ) : (
        <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/50 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="border-b border-stone-200/50 text-[11px] uppercase tracking-widest text-stone-500">
                <tr>
                  <th className="px-8 py-5 font-medium">Nombre</th>
                  <th className="px-8 py-5 font-medium">Contacto</th>
                  <th className="px-8 py-5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((patient) => (
                  <tr key={patient.id} className="transition-colors hover:bg-white/80">
                    <td className="px-8 py-5 font-medium text-stone-900">{patient.name}</td>
                    <td className="px-8 py-5">
                      {patient.email}
                      {patient.phone ? <span className="text-stone-400"> · {patient.phone}</span> : null}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="ghost" size="sm" className="rounded-full px-5">
                            Ficha
                          </Button>
                        </Link>
                        <Link href={`/patients/${patient.id}/sessions/new`}>
                          <Button variant="secondary" size="sm" className="rounded-full px-5">
                            Nueva sesión
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
