import { createServerClient } from '@/lib/supabase/server';
import { mapUserAdminListItem } from '@/modules/users/mappers';

export async function listAdminUsers() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, email, username, name, lastname, professional_title, role, is_active, created_at, updated_at',
    )
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapUserAdminListItem);
}
