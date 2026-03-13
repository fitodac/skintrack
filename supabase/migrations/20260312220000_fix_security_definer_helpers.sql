create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'superadmin'
      and is_active = true
  );
$$;

create or replace function public.can_manage_profile(profile_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() = profile_uuid or public.is_superadmin();
$$;

create or replace function public.can_access_patient(patient_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.patients p
    where p.id = patient_uuid
      and p.archived_at is null
      and (
        public.is_superadmin()
        or p.admin_user_id = auth.uid()
      )
  );
$$;

create or replace function public.can_access_session(session_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.clinical_sessions s
    join public.patients p on p.id = s.patient_id
    where s.id = session_uuid
      and s.archived_at is null
      and (
        public.is_superadmin()
        or p.admin_user_id = auth.uid()
      )
  );
$$;

grant execute on function public.is_superadmin() to authenticated;
grant execute on function public.can_manage_profile(uuid) to authenticated;
grant execute on function public.can_access_patient(uuid) to authenticated;
grant execute on function public.can_access_session(uuid) to authenticated;
