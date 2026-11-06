-- Baseline for a fresh FA Wizard project. Existing records are never dropped.
begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  is_admin boolean not null default false,
  is_subscribed boolean not null default false,
  customer_id text unique,
  price_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_email_lower_idx on public.profiles(lower(email));

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  full_name text not null default '',
  title text not null default '',
  email text not null default '',
  office_phone text not null default '',
  cell_phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contacts_user_id_idx on public.contacts(user_id);

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  full_school_name text not null default '',
  short_school_name text not null default '',
  street_address text not null default '',
  city text not null default '',
  state text not null default '',
  zip_code text not null default '',
  primary_contact_id uuid references public.contacts(id) on delete set null,
  secondary_contact_id uuid references public.contacts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists schools_primary_contact_idx on public.schools(primary_contact_id);
create index if not exists schools_secondary_contact_idx on public.schools(secondary_contact_id);

-- Set this private allowlist separately during the operator's admin setup.
-- No email addresses or privilege flags are accepted from signup metadata.
create table if not exists private.admin_bootstrap (
  email text primary key check (email = lower(email)),
  purpose text not null,
  created_at timestamptz not null default now()
);
alter table private.admin_bootstrap enable row level security;
revoke all on private.admin_bootstrap from public, anon, authenticated;

create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and is_admin);
$$;
create or replace function private.can_manage_own_school() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and (is_subscribed or is_admin));
$$;
revoke all on function private.is_admin() from public;
revoke all on function private.can_manage_own_school() from public;
grant execute on function private.is_admin(), private.can_manage_own_school() to authenticated, service_role;

create or replace function private.create_user_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, email, full_name, first_name, last_name, phone, is_admin)
  values(new.id, lower(new.email),
    concat_ws(' ', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name'),
    coalesce(new.raw_user_meta_data->>'first_name',''),
    coalesce(new.raw_user_meta_data->>'last_name',''),
    coalesce(new.raw_user_meta_data->>'phone',''),
    exists(select 1 from private.admin_bootstrap where email = lower(new.email)))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function private.create_user_profile() from public;
create trigger fa_wizard_create_profile after insert on auth.users
for each row execute function private.create_user_profile();

create or replace function private.protect_profile() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated') then
    if new.id is distinct from old.id or new.email is distinct from old.email
      or new.customer_id is distinct from old.customer_id
      or new.price_id is distinct from old.price_id
      or new.is_subscribed is distinct from old.is_subscribed then
      raise exception 'Account identity and billing fields are managed by the server';
    end if;
    if new.is_admin is distinct from old.is_admin then
      if not private.is_admin() then
        raise exception 'Only an administrator may change admin access';
      end if;
      if old.is_admin and not new.is_admin and not exists(
        select 1 from public.profiles where is_admin and id <> old.id
      ) then
        raise exception 'The final administrator cannot be removed';
      end if;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function private.protect_profile() from public;
create trigger fa_wizard_protect_profile before update on public.profiles
for each row execute function private.protect_profile();

create or replace function private.check_school_contacts() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.primary_contact_id is not null and not exists(
    select 1 from public.contacts where id = new.primary_contact_id and user_id = new.user_id
  ) then raise exception 'Primary contact must belong to the school owner'; end if;
  if new.secondary_contact_id is not null and not exists(
    select 1 from public.contacts where id = new.secondary_contact_id and user_id = new.user_id
  ) then raise exception 'Secondary contact must belong to the school owner'; end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function private.check_school_contacts() from public;
create trigger fa_wizard_check_contacts before insert or update on public.schools
for each row execute function private.check_school_contacts();

alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.schools enable row level security;
revoke all on public.profiles, public.contacts, public.schools from public, anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.contacts, public.schools to authenticated;
grant all on public.profiles, public.contacts, public.schools to service_role;

create policy profiles_read on public.profiles for select to authenticated
using(id = (select auth.uid()) or (select private.is_admin()));
create policy profiles_create on public.profiles for insert to authenticated
with check(id = (select auth.uid()) and lower(email) = lower(auth.jwt()->>'email')
  and not is_admin and not is_subscribed and customer_id is null and price_id is null);
create policy profiles_update on public.profiles for update to authenticated
using(id = (select auth.uid()) or (select private.is_admin()))
with check(id = (select auth.uid()) or (select private.is_admin()));

create policy contacts_read on public.contacts for select to authenticated
using(user_id = (select auth.uid()) or (select private.is_admin()));
create policy contacts_create on public.contacts for insert to authenticated
with check((user_id = (select auth.uid()) and (select private.can_manage_own_school())) or (select private.is_admin()));
create policy contacts_update on public.contacts for update to authenticated
using((user_id = (select auth.uid()) and (select private.can_manage_own_school())) or (select private.is_admin()))
with check((user_id = (select auth.uid()) and (select private.can_manage_own_school())) or (select private.is_admin()));
create policy contacts_delete on public.contacts for delete to authenticated
using((user_id = (select auth.uid()) and (select private.can_manage_own_school())) or (select private.is_admin()));

create policy schools_read on public.schools for select to authenticated
using(user_id = (select auth.uid()) or (select private.is_admin()));
create policy schools_create on public.schools for insert to authenticated
with check((user_id = (select auth.uid()) and (select private.can_manage_own_school())) or (select private.is_admin()));
create policy schools_update on public.schools for update to authenticated
using((user_id = (select auth.uid()) and (select private.can_manage_own_school())) or (select private.is_admin()))
with check((user_id = (select auth.uid()) and (select private.can_manage_own_school())) or (select private.is_admin()));
create policy schools_delete on public.schools for delete to authenticated
using((select private.is_admin()));

-- Also handles accounts already created in a fresh project before this baseline.
insert into public.profiles(id, email, first_name, last_name, phone)
select id, lower(email), coalesce(raw_user_meta_data->>'first_name',''),
  coalesce(raw_user_meta_data->>'last_name',''), coalesce(raw_user_meta_data->>'phone','')
from auth.users where email is not null on conflict (id) do nothing;

notify pgrst, 'reload schema';
commit;
