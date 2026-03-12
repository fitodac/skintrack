import { PageShell } from '@/components/shared/page-shell';
import { requireViewer } from '@/lib/auth';
import { ProfileSettings } from '@/modules/profile/components/profile-settings';

export default async function ProfilePage() {
  const viewer = await requireViewer();

  return (
    <PageShell
      title="Perfil"
      description="Administrá tu identidad profesional y la seguridad de tu cuenta."
    >
      <ProfileSettings viewer={viewer} />
    </PageShell>
  );
}
