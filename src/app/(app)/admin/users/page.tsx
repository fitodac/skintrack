import { PageShell } from '@/components/shared/page-shell';
import { requireSuperadmin } from '@/lib/auth';
import { listAdminUsers } from '@/modules/users/queries';
import { UsersAdminPanel } from '@/modules/users/components/users-admin-panel';

export default async function AdminUsersPage() {
  await requireSuperadmin();
  const users = await listAdminUsers();

  return (
    <PageShell
      title="Usuarios"
      description="Invitá nuevas profesionales, ajustá roles y activá o desactivá accesos."
    >
      <UsersAdminPanel users={users} />
    </PageShell>
  );
}
