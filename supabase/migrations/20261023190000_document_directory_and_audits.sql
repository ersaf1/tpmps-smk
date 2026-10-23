-- Migrasi Direktori Dokumen, Audit Mutu, dan Penyesuaian Role Ibu Vickky
begin;

-- 1. Penyesuaian role akun Ibu Vickky menjadi superadmin
update tpmps.profiles
set role = 'superadmin'
where id in (
  select id from auth.users 
  where lower(email) in (
    'vickky.listyaningsih@smkn2magelang.sch.id',
    'tpmps.ketua@smkn2magelang.sch.id'
  )
);

-- 2. Tabel Direktori Dokumen & Letak Penyimpanan
create table if not exists tpmps.documents (
  id uuid primary key default gen_random_uuid(),
  nomor_dokumen text not null check(length(trim(nomor_dokumen)) between 1 and 100),
  nama_dokumen text not null check(length(trim(nama_dokumen)) between 1 and 255),
  unit_id uuid references tpmps.units(id) on delete set null,
  unit text not null check(length(trim(unit)) between 1 and 160),
  letak_dokumen text not null check(length(trim(letak_dokumen)) between 1 and 500),
  file_path text,
  file_id uuid references tpmps.files(id) on delete set null,
  created_by uuid references tpmps.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_nomor on tpmps.documents(nomor_dokumen);
create index if not exists idx_documents_nama on tpmps.documents(nama_dokumen);
create index if not exists idx_documents_unit on tpmps.documents(unit);
create index if not exists idx_documents_unit_id on tpmps.documents(unit_id);
create index if not exists idx_documents_created_at on tpmps.documents(created_at desc);

-- 3. Tabel Riwayat & Hasil Audit Dokumen TPMPS
create table if not exists tpmps.audits (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references tpmps.documents(id) on delete cascade,
  status_approval text not null default 'pending' check(status_approval in ('pending', 'approved', 'revisi')),
  kelebihan text default '',
  kekurangan text default '',
  auditor_id uuid references tpmps.profiles(id) on delete set null,
  nama_auditor text not null check(length(trim(nama_auditor)) between 1 and 160),
  tanggal_audit date not null default (clock_timestamp() at time zone 'Asia/Jakarta')::date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_audits_document_id on tpmps.audits(document_id);
create index if not exists idx_audits_status on tpmps.audits(status_approval);

-- 4. View Agregasi Dokumen & Status Audit Terbaru
create or replace view tpmps.v_document_directory as
select 
  d.id,
  d.nomor_dokumen,
  d.nama_dokumen,
  d.unit_id,
  d.unit,
  d.letak_dokumen,
  d.file_path,
  d.file_id,
  d.created_by,
  d.created_at,
  d.updated_at,
  coalesce(a.status_approval, 'pending') as status_approval,
  a.id as audit_id,
  a.kelebihan,
  a.kekurangan,
  a.auditor_id,
  a.nama_auditor,
  a.tanggal_audit
from tpmps.documents d
left join lateral (
  select *
  from tpmps.audits
  where audits.document_id = d.id
  order by audits.created_at desc
  limit 1
) a on true;

-- 5. Hak Akses & RLS
alter table tpmps.documents enable row level security;
alter table tpmps.audits enable row level security;

grant select, insert, update, delete on tpmps.documents to authenticated, service_role;
grant select, insert, update, delete on tpmps.audits to authenticated, service_role;
grant select on tpmps.v_document_directory to authenticated, service_role;

-- Policies for tpmps.documents
drop policy if exists documents_read on tpmps.documents;
create policy documents_read on tpmps.documents
  for select to authenticated
  using (tpmps_private.active_role() is not null);

drop policy if exists documents_insert on tpmps.documents;
create policy documents_insert on tpmps.documents
  for insert to authenticated
  with check (
    tpmps_private.is_admin() or 
    tpmps_private.active_role() = 'ketua_tpmps' or 
    (tpmps_private.active_role() = 'kepala_unit' and unit_id = (select p.unit_id from tpmps.profiles p where p.id = auth.uid()))
  );

drop policy if exists documents_update on tpmps.documents;
create policy documents_update on tpmps.documents
  for update to authenticated
  using (
    tpmps_private.is_admin() or 
    tpmps_private.active_role() = 'ketua_tpmps' or 
    (tpmps_private.active_role() = 'kepala_unit' and unit_id = (select p.unit_id from tpmps.profiles p where p.id = auth.uid()))
  );

drop policy if exists documents_delete on tpmps.documents;
create policy documents_delete on tpmps.documents
  for delete to authenticated
  using (tpmps_private.is_admin() or tpmps_private.active_role() = 'ketua_tpmps');

-- Policies for tpmps.audits
drop policy if exists audits_read on tpmps.audits;
create policy audits_read on tpmps.audits
  for select to authenticated
  using (tpmps_private.active_role() is not null);

drop policy if exists audits_write on tpmps.audits;
create policy audits_write on tpmps.audits
  for all to authenticated
  using (tpmps_private.is_admin() or tpmps_private.active_role() = 'ketua_tpmps')
  with check (tpmps_private.is_admin() or tpmps_private.active_role() = 'ketua_tpmps');

commit;
