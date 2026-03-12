import type { Database } from '@/types/supabase';
import type { UserAdminListItemDTO } from '@/modules/users/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function mapUserAdminListItem(row: ProfileRow): UserAdminListItemDTO {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    name: row.name,
    lastname: row.lastname,
    professionalTitle: row.professional_title,
    role: row.role,
    isActive: row.is_active,
  };
}
