-- SINTESA TPMPS v2: document management focused schema.
-- This migration intentionally removes the previous demo/evaluation modules.

begin;

-- Remove legacy application objects. Auth and Storage managed schemas are retained.
drop table if exists public.evidence cascade;
drop table if exists public.documents cascade;
drop table if exists public.rtl_program cascade;
drop table if exists public.evaluations cascade;
drop table if exists public.standards cascade;
drop table if exists public.activity_logs cascade;
-- Legacy identity tables are retained because older migrations created helper
-- functions inside the managed `auth` schema that depend on them. The v2 app
-- does not grant or query these tables.
drop table if exists public.audit_logs cascade;
drop table if exists public.berkas_laci cascade;
drop table if exists public.laci_unit cascade;
drop table if exists public.lemari_unit cascade;
drop table if exists public.unit_kerja cascade;

-- Legacy enum types are retained for the same managed-schema compatibility.

create type public.document_role as enum (
  'superadmin',
  'ketua_tpmps',
  'kepala_sekolah',
  'ketua_unit'
);

create type public.folder_scope as enum ('tpmps', 'unit');
create type public.document_kind as enum (
  'manual_mutu',
  'prosedur_mutu',
  'dokumen_lainnya',
  'petunjuk_kerja',
  'catatan_mutu'
);

create table public.document_units (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]+$'),
  name text not null unique check (char_length(name) between 2 and 100),
  leader_name text not null check (char_length(leader_name) between 2 and 160),
  position_name text not null check (char_length(position_name) between 2 and 100),
  sort_order smallint not null unique check (sort_order between 1 and 16),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null check (char_length(full_name) between 2 and 160),
  position_name text not null check (char_length(position_name) between 2 and 100),
  role public.document_role not null,
  unit_id uuid references public.document_units(id) on delete restrict,
  is_active boolean not null default true,
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_unit_check check (
    (role = 'ketua_unit' and unit_id is not null)
    or (role <> 'ketua_unit' and unit_id is null)
  )
);

create table public.periods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name ~ '^[0-9]{4}/[0-9]{4}$'),
  starts_on date not null,
  ends_on date not null,
  is_active boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint periods_date_check check (ends_on > starts_on)
);

create unique index periods_single_active_idx
  on public.periods (is_active)
  where is_active;

create table public.folders (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.periods(id) on delete cascade,
  parent_id uuid references public.folders(id) on delete cascade,
  unit_id uuid references public.document_units(id) on delete restrict,
  scope public.folder_scope not null,
  document_kind public.document_kind,
  name text not null check (char_length(trim(name)) between 1 and 120),
  created_by uuid not null references public.profiles(id) on delete restrict,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint folders_scope_unit_check check (
    (scope = 'tpmps' and unit_id is null)
    or (scope = 'unit' and unit_id is not null)
  ),
  constraint folders_kind_scope_check check (
    document_kind is null
    or (scope = 'tpmps' and document_kind in ('manual_mutu', 'prosedur_mutu', 'dokumen_lainnya'))
    or (scope = 'unit' and document_kind in ('petunjuk_kerja', 'catatan_mutu'))
  )
);

create unique index folders_unique_active_name_idx
  on public.folders (
    period_id,
    coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(unit_id, '00000000-0000-0000-0000-000000000000'::uuid),
    lower(name)
  )
  where deleted_at is null;

create index folders_period_parent_idx on public.folders(period_id, parent_id);
create index folders_unit_idx on public.folders(unit_id) where unit_id is not null;

create table public.file_entries (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references public.folders(id) on delete cascade,
  storage_path text not null unique,
  original_name text not null check (char_length(original_name) between 1 and 255),
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  created_by uuid not null references public.profiles(id) on delete restrict,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index file_entries_folder_idx on public.file_entries(folder_id) where deleted_at is null;
create index file_entries_created_by_idx on public.file_entries(created_by);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  action text not null check (action in (
    'LOGIN', 'CREATE_PERIOD', 'UPDATE_PERIOD', 'CREATE_FOLDER',
    'RENAME_FOLDER', 'DELETE_FOLDER', 'UPLOAD_FILE', 'RENAME_FILE',
    'DELETE_FILE', 'DOWNLOAD_FILE'
  )),
  entity_type text not null check (entity_type in ('auth', 'period', 'folder', 'file')),
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_actor_created_idx on public.audit_logs(actor_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger document_units_set_updated_at before update on public.document_units
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger periods_set_updated_at before update on public.periods
for each row execute function public.set_updated_at();
create trigger folders_set_updated_at before update on public.folders
for each row execute function public.set_updated_at();
create trigger file_entries_set_updated_at before update on public.file_entries
for each row execute function public.set_updated_at();

create or replace function public.validate_folder_parent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  parent_row public.folders%rowtype;
begin
  if new.parent_id is null then
    return new;
  end if;
  if new.parent_id = new.id then
    raise exception 'Folder tidak dapat menjadi induknya sendiri';
  end if;
  select * into parent_row from public.folders where id = new.parent_id and deleted_at is null;
  if not found
    or parent_row.period_id <> new.period_id
    or parent_row.scope <> new.scope
    or parent_row.unit_id is distinct from new.unit_id then
    raise exception 'Folder induk tidak valid';
  end if;
  if exists (
    with recursive ancestors as (
      select f.id, f.parent_id from public.folders f where f.id = new.parent_id
      union all
      select f.id, f.parent_id from public.folders f join ancestors a on f.id = a.parent_id
    )
    select 1 from ancestors where id = new.id
  ) then
    raise exception 'Siklus folder tidak diizinkan';
  end if;
  return new;
end;
$$;

create trigger folders_validate_parent before insert or update of parent_id, period_id, scope, unit_id on public.folders
for each row execute function public.validate_folder_parent();

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.current_profile_role()
returns public.document_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid()) and p.is_active;
$$;

create or replace function private.current_profile_unit()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.unit_id
  from public.profiles p
  where p.id = (select auth.uid()) and p.is_active;
$$;

create or replace function private.can_read_folder(target_folder_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.folders f
    join public.profiles p on p.id = (select auth.uid()) and p.is_active
    where f.id = target_folder_id
      and f.deleted_at is null
      and (
        p.role in ('superadmin', 'ketua_tpmps', 'kepala_sekolah')
        or (p.role = 'ketua_unit' and f.scope = 'unit' and f.unit_id = p.unit_id)
      )
  );
$$;

create or replace function private.can_write_folder(target_folder_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.folders f
    join public.profiles p on p.id = (select auth.uid()) and p.is_active
    where f.id = target_folder_id
      and f.deleted_at is null
      and (
        p.role = 'superadmin'
        or (p.role = 'ketua_tpmps' and f.scope = 'tpmps')
        or (p.role = 'ketua_unit' and f.scope = 'unit' and f.unit_id = p.unit_id)
      )
  );
$$;

create or replace function private.can_read_storage_object(target_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.file_entries e
    where e.storage_path = target_path
      and e.deleted_at is null
      and private.can_read_folder(e.folder_id)
  );
$$;

create or replace function public.mark_password_changed()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles
  set must_change_password = false, updated_at = now()
  where id = (select auth.uid());
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.validate_folder_parent() from public, anon, authenticated;
revoke execute on function private.current_profile_role() from public, anon;
revoke execute on function private.current_profile_unit() from public, anon;
revoke execute on function private.can_read_folder(uuid) from public, anon;
revoke execute on function private.can_write_folder(uuid) from public, anon;
revoke execute on function private.can_read_storage_object(text) from public, anon;
revoke execute on function public.mark_password_changed() from public, anon;
grant execute on function private.current_profile_role() to authenticated;
grant execute on function private.current_profile_unit() to authenticated;
grant execute on function private.can_read_folder(uuid) to authenticated;
grant execute on function private.can_write_folder(uuid) to authenticated;
grant execute on function private.can_read_storage_object(text) to authenticated;
grant execute on function public.mark_password_changed() to authenticated;

alter table public.document_units enable row level security;
alter table public.profiles enable row level security;
alter table public.periods enable row level security;
alter table public.folders enable row level security;
alter table public.file_entries enable row level security;
alter table public.audit_logs enable row level security;

revoke all on table public.document_units, public.profiles, public.periods, public.folders, public.file_entries, public.audit_logs from anon, authenticated;
grant select on table public.document_units, public.profiles, public.periods, public.folders, public.file_entries, public.audit_logs to authenticated;
grant insert, update, delete on table public.document_units, public.profiles, public.periods, public.folders, public.file_entries to authenticated;
grant insert on table public.audit_logs to authenticated;
grant usage, select on sequence public.audit_logs_id_seq to authenticated;

create policy document_units_read on public.document_units for select to authenticated
using ((select private.current_profile_role()) is not null);
create policy document_units_admin_insert on public.document_units for insert to authenticated
with check ((select private.current_profile_role()) = 'superadmin');
create policy document_units_admin_update on public.document_units for update to authenticated
using ((select private.current_profile_role()) = 'superadmin')
with check ((select private.current_profile_role()) = 'superadmin');
create policy document_units_admin_delete on public.document_units for delete to authenticated
using ((select private.current_profile_role()) = 'superadmin');

create policy profiles_read on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.current_profile_role()) = 'superadmin');
create policy profiles_admin_insert on public.profiles for insert to authenticated
with check ((select private.current_profile_role()) = 'superadmin');
create policy profiles_admin_update on public.profiles for update to authenticated
using ((select private.current_profile_role()) = 'superadmin')
with check ((select private.current_profile_role()) = 'superadmin');
create policy profiles_admin_delete on public.profiles for delete to authenticated
using ((select private.current_profile_role()) = 'superadmin');

create policy periods_read on public.periods for select to authenticated
using ((select private.current_profile_role()) is not null);
create policy periods_create on public.periods for insert to authenticated
with check ((select private.current_profile_role()) in ('superadmin', 'kepala_sekolah'));
create policy periods_update on public.periods for update to authenticated
using ((select private.current_profile_role()) in ('superadmin', 'kepala_sekolah'))
with check ((select private.current_profile_role()) in ('superadmin', 'kepala_sekolah'));
create policy periods_delete on public.periods for delete to authenticated
using ((select private.current_profile_role()) = 'superadmin');

create policy folders_read on public.folders for select to authenticated
using ((select private.can_read_folder(id)));
create policy folders_create on public.folders for insert to authenticated
with check (
  (select private.current_profile_role()) = 'superadmin'
  or ((select private.current_profile_role()) = 'ketua_tpmps' and scope = 'tpmps' and unit_id is null)
  or ((select private.current_profile_role()) = 'ketua_unit' and scope = 'unit' and unit_id = (select private.current_profile_unit()))
);
create policy folders_update on public.folders for update to authenticated
using ((select private.can_write_folder(id)))
with check (
  (select private.current_profile_role()) = 'superadmin'
  or ((select private.current_profile_role()) = 'ketua_tpmps' and scope = 'tpmps' and unit_id is null)
  or ((select private.current_profile_role()) = 'ketua_unit' and scope = 'unit' and unit_id = (select private.current_profile_unit()))
);
create policy folders_delete on public.folders for delete to authenticated
using ((select private.can_write_folder(id)));

create policy files_read on public.file_entries for select to authenticated
using ((select private.can_read_folder(folder_id)));
create policy files_create on public.file_entries for insert to authenticated
with check (
  created_by = (select auth.uid())
  and split_part(storage_path, '/', 1) = (select auth.uid()::text)
  and (select private.can_write_folder(folder_id))
);
create policy files_update on public.file_entries for update to authenticated
using ((select private.can_write_folder(folder_id)))
with check ((select private.can_write_folder(folder_id)));
create policy files_delete on public.file_entries for delete to authenticated
using ((select private.can_write_folder(folder_id)));

create policy audit_read on public.audit_logs for select to authenticated
using (
  actor_id = (select auth.uid())
  or (select private.current_profile_role()) in ('superadmin', 'ketua_tpmps', 'kepala_sekolah')
);
create policy audit_insert on public.audit_logs for insert to authenticated
with check (actor_id = (select auth.uid()));

insert into public.document_units (code, name, leader_name, position_name, sort_order) values
  ('RENBANG', 'Perencanaan dan Pengembangan', 'Dra. Gigih Murniati', 'Ka. Renbang', 1),
  ('WKS-1', 'Wakil Kepala Sekolah 1', 'Yuana Dwi Utami, S.Pd.', 'WKS 1', 2),
  ('WKS-2', 'Wakil Kepala Sekolah 2', 'Drs. Agus Supriyanto', 'WKS 2', 3),
  ('WKS-3', 'Wakil Kepala Sekolah 3', 'May Wilasih, S.Pd.', 'WKS 3', 4),
  ('WKS-4', 'Wakil Kepala Sekolah 4', 'Antuk Madiyanto, S.Pd.', 'WKS 4', 5),
  ('AKL', 'Program Keahlian AKL', 'Cicilia Nugrahanti, S.Pd.', 'Kaproli AKL', 6),
  ('MPLB', 'Program Keahlian MPLB', 'Purwaningsri, S.Pd., M.M.', 'Kaproli MPLB', 7),
  ('PM', 'Program Keahlian Pemasaran', 'Fieka Praditaliana, S.Pd.', 'Kaproli PM', 8),
  ('PPLG', 'Program Keahlian PPLG', 'Arifin Andi Gunawan, S.Kom.', 'Kaproli PPLG', 9),
  ('UMUM', 'Bagian Umum', 'Mugi Rahayu, S.Pd., M.Pd.', 'Ka. Umum', 10),
  ('TU', 'Tata Usaha', 'Murtiningsih, S.Pd., M.Pd.', 'Ka. TU', 11),
  ('BK', 'Bimbingan Konseling', 'Esti Zunastiti, S.Pd.', 'Ka. BK', 12),
  ('BKK', 'Bursa Kerja Khusus', 'Anggraini Kusumawardani, S.Pd.', 'Ka. BKK', 13),
  ('PERPUS', 'Perpustakaan', 'Dra. Wiwik Pristiwati', 'Ka. Perpustakaan', 14),
  ('LAB', 'Laboratorium', 'Yunus Adi Wibowo, S.Kom.', 'Ka. Lab', 15),
  ('USMAN', 'Unit Manajemen', 'Tri Djoko, S.Pd.', 'Ka. Usman', 16);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800,
  null
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists documents_storage_read on storage.objects;
drop policy if exists documents_storage_insert on storage.objects;
drop policy if exists documents_storage_update on storage.objects;
drop policy if exists documents_storage_delete on storage.objects;

create policy documents_storage_read on storage.objects for select to authenticated
using (
  bucket_id = 'documents'
  and (owner_id = (select auth.uid()::text) or (select private.can_read_storage_object(name)))
);
create policy documents_storage_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
create policy documents_storage_update on storage.objects for update to authenticated
using (
  bucket_id = 'documents'
  and (owner_id = (select auth.uid()::text) or (select private.current_profile_role()) = 'superadmin')
)
with check (bucket_id = 'documents');
create policy documents_storage_delete on storage.objects for delete to authenticated
using (
  bucket_id = 'documents'
  and (owner_id = (select auth.uid()::text) or (select private.current_profile_role()) = 'superadmin')
);

commit;
