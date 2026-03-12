import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

export type Viewer = Database['public']['Tables']['profiles']['Row'];

export const getViewer = cache(async () => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      'id, email, username, name, lastname, professional_title, role, is_active, created_at, updated_at',
    )
    .eq('id', user.id)
    .single();

  if (error || !profile || !profile.is_active) {
    return null;
  }

  return profile;
});

export async function requireViewer() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect('/login');
  }

  return viewer;
}

export async function requireSuperadmin() {
  const viewer = await requireViewer();

  if (viewer.role !== 'superadmin') {
    redirect('/patients');
  }

  return viewer;
}
