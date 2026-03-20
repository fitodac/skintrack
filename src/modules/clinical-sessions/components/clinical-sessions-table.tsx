import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { ClinicalSessionListItemDTO } from '@/modules/clinical-sessions/types';

type ClinicalSessionsTableProps = {
  patientId: string;
  sessions: ClinicalSessionListItemDTO[];
};

export function ClinicalSessionsTable({ patientId, sessions }: ClinicalSessionsTableProps) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/50 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="border-b border-stone-200/50 text-[11px] uppercase tracking-widest text-stone-500">
            <tr>
              <th className="px-8 py-5 font-medium">Fecha</th>
              <th className="px-8 py-5 font-medium">Diagnóstico</th>
              <th className="px-8 py-5 font-medium">Estado</th>
              <th className="px-8 py-5 font-medium">Actualizada</th>
              <th className="px-8 py-5 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sessions.length === 0 ? (
              <tr>
                <td className="px-8 py-6 text-stone-500" colSpan={5}>
                  Todavía no hay sesiones registradas para esta paciente.
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr key={session.id} className="transition-colors hover:bg-white/80">
                  <td className="px-8 py-5 font-medium text-stone-900">
                    {formatDate(session.date)}
                  </td>
                  <td className="px-8 py-5">{session.diagnosis || 'Sin diagnóstico cargado'}</td>
                  <td className="px-8 py-5">
                    <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                      {session.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-stone-500">{formatDateTime(session.updatedAt)}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/patients/${patientId}/sessions/${session.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-full px-5">
                          Abrir
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

