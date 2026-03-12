export interface UserAdminListItemDTO {
  id: string;
  email: string;
  username: string;
  name: string;
  lastname: string;
  professionalTitle: string | null;
  role: 'superadmin' | 'admin';
  isActive: boolean;
}
