create extension if not exists pgcrypto;

create type public.app_role as enum ('superadmin', 'admin');
create type public.session_status as enum ('draft', 'completed');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  username text not null unique,
  name text not null,
  lastname text not null,
  professional_title text,
  role public.app_role not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role public.app_role not null default 'admin',
  invited_name text not null,
  invited_lastname text not null,
  professional_title text,
  invited_by uuid not null references public.profiles (id),
  invitation_status public.invitation_status not null default 'pending',
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.profiles (id),
  name text not null,
  born_date date,
  nationality text,
  marital_status text,
  number_of_children smallint,
  street text,
  street_number text,
  location text,
  email text not null,
  phone text,
  instagram_account text,
  healthcare_plan text,
  healthcare_plan_number text,
  person_for_contact text,
  occupation text,
  working_hours text,
  first_consultation_date date,
  hereditary_history text,
  allergic_history text,
  organic_history text,
  thyroid boolean not null default false,
  weight_loss boolean not null default false,
  hypertrichosis boolean not null default false,
  hirsutism boolean not null default false,
  obesity boolean not null default false,
  gastrointestinal_history boolean,
  pregnancy boolean not null default false,
  medication text,
  alcohol boolean not null default false,
  drugs boolean not null default false,
  smoke boolean not null default false,
  other_medical_history text,
  cosmetics_used text,
  previous_and_current_treatments text,
  current_home_treatment text,
  diet text,
  modifications_or_suggestions text,
  created_by uuid not null references public.profiles (id),
  updated_by uuid not null references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz
);

create table if not exists public.clinical_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  date date not null default current_date,
  consultation_reason text,
  closed_comedones boolean not null default false,
  open_comedones boolean not null default false,
  papules boolean not null default false,
  pustules boolean not null default false,
  nodules boolean not null default false,
  tubercles boolean not null default false,
  scars boolean not null default false,
  excoriations boolean not null default false,
  milium_cysts boolean not null default false,
  sebaceous_cysts boolean not null default false,
  macules boolean not null default false,
  diagnosis text,
  goals text,
  cleaning text,
  return_to_eudermia text,
  exfoliation text,
  asepsis text,
  extractions text,
  pa text,
  massages text,
  mask text,
  final_product text,
  sunscreen text,
  applied_apparatus text,
  home_care_day text,
  home_care_night text,
  status public.session_status not null default 'draft',
  last_saved_at timestamptz not null default timezone('utc', now()),
  created_by uuid not null references public.profiles (id),
  updated_by uuid not null references public.profiles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists user_invitations_set_updated_at on public.user_invitations;
create trigger user_invitations_set_updated_at
before update on public.user_invitations
for each row
execute function public.set_updated_at();

drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at
before update on public.patients
for each row
execute function public.set_updated_at();

drop trigger if exists clinical_sessions_set_updated_at on public.clinical_sessions;
create trigger clinical_sessions_set_updated_at
before update on public.clinical_sessions
for each row
execute function public.set_updated_at();

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

create or replace function public.complete_user_onboarding()
returns table (profile_id uuid, role public.app_role)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text;
  invitation_record public.user_invitations%rowtype;
  existing_profile public.profiles%rowtype;
  base_username text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  current_email := lower(coalesce(auth.jwt()->>'email', ''));

  if current_email = '' then
    raise exception 'missing_email';
  end if;

  select *
  into existing_profile
  from public.profiles
  where id = auth.uid();

  if found then
    if existing_profile.is_active = false then
      raise exception 'user_inactive';
    end if;

    return query
    select existing_profile.id, existing_profile.role;
    return;
  end if;

  select *
  into invitation_record
  from public.user_invitations
  where lower(email) = current_email
    and invitation_status = 'pending'
  limit 1;

  if not found then
    raise exception 'unauthorized_email';
  end if;

  base_username := regexp_replace(split_part(current_email, '@', 1), '[^a-zA-Z0-9_]+', '', 'g');
  base_username := left(base_username, 24);

  insert into public.profiles (
    id,
    email,
    username,
    name,
    lastname,
    professional_title,
    role,
    is_active
  )
  values (
    auth.uid(),
    current_email,
    concat(base_username, '_', substr(replace(auth.uid()::text, '-', ''), 1, 6)),
    invitation_record.invited_name,
    invitation_record.invited_lastname,
    invitation_record.professional_title,
    invitation_record.role,
    true
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = excluded.name,
    lastname = excluded.lastname,
    professional_title = excluded.professional_title,
    role = excluded.role,
    is_active = true;

  update public.user_invitations
  set
    invitation_status = 'accepted',
    accepted_at = timezone('utc', now())
  where id = invitation_record.id;

  return query
  select auth.uid(), invitation_record.role;
end;
$$;

grant execute on function public.complete_user_onboarding() to authenticated;
grant execute on function public.is_superadmin() to authenticated;
grant execute on function public.can_manage_profile(uuid) to authenticated;
grant execute on function public.can_access_patient(uuid) to authenticated;
grant execute on function public.can_access_session(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.user_invitations enable row level security;
alter table public.patients enable row level security;
alter table public.clinical_sessions enable row level security;

create policy "Profiles readable by self or superadmin"
on public.profiles
for select
to authenticated
using (public.can_manage_profile(id));

create policy "Profiles editable by self or superadmin"
on public.profiles
for update
to authenticated
using (public.can_manage_profile(id))
with check (public.can_manage_profile(id));

create policy "Invitations managed by superadmin"
on public.user_invitations
for all
to authenticated
using (public.is_superadmin())
with check (public.is_superadmin());

create policy "Patients selectable by owner or superadmin"
on public.patients
for select
to authenticated
using (
  archived_at is null
  and (
    public.is_superadmin()
    or admin_user_id = auth.uid()
  )
);

create policy "Patients insertable by admin owner or superadmin"
on public.patients
for insert
to authenticated
with check (
  public.is_superadmin()
  or admin_user_id = auth.uid()
);

create policy "Patients updateable by owner or superadmin"
on public.patients
for update
to authenticated
using (
  public.is_superadmin()
  or admin_user_id = auth.uid()
)
with check (
  public.is_superadmin()
  or admin_user_id = auth.uid()
);

create policy "Sessions selectable by patient access"
on public.clinical_sessions
for select
to authenticated
using (
  archived_at is null
  and public.can_access_patient(patient_id)
);

create policy "Sessions insertable by patient access"
on public.clinical_sessions
for insert
to authenticated
with check (public.can_access_patient(patient_id));

create policy "Sessions updateable by patient access"
on public.clinical_sessions
for update
to authenticated
using (public.can_access_patient(patient_id))
with check (public.can_access_patient(patient_id));

comment on table public.user_invitations is
'Invitations for pre-authorized emails. Seed real emails for master and sandra in each environment before first access.';
