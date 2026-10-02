-- TPMPS application schema; no application data is seeded.
begin;
create schema tpmps;
grant usage on schema tpmps to authenticated,service_role;
create schema if not exists tpmps_private;
revoke all on schema tpmps_private from public;
grant usage on schema tpmps_private to authenticated;
create table tpmps.units(id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name)) between 1 and 160), active boolean not null default true, created_at timestamptz not null default now());
create table tpmps.profiles(id uuid primary key references auth.users(id) on delete restrict, full_name text not null check(length(trim(full_name)) between 1 and 160), role text not null check(role in ('superadmin','kepala_sekolah','ketua_tpmps','kepala_unit')), unit_id uuid references tpmps.units(id) on delete restrict, active boolean not null default true, created_at timestamptz not null default now(), check((role='kepala_unit')=(unit_id is not null)));
create table tpmps.periods(id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name)) between 1 and 160), starts_on date not null, ends_on date not null, created_at timestamptz not null default now(), check(starts_on<=ends_on));
create table tpmps.document_spaces(id uuid primary key default gen_random_uuid(), period_id uuid not null references tpmps.periods(id) on delete restrict, unit_id uuid references tpmps.units(id) on delete restrict, name text not null, unique nulls not distinct(period_id,unit_id));
create table tpmps.folders(id uuid primary key default gen_random_uuid(), space_id uuid not null references tpmps.document_spaces(id) on delete restrict, parent_id uuid, name text not null check(length(trim(name)) between 1 and 255), created_at timestamptz not null default now(), unique(id,space_id), foreign key(parent_id,space_id) references tpmps.folders(id,space_id) on delete restrict, unique nulls not distinct(space_id,parent_id,name));
create table tpmps.files(id uuid primary key default gen_random_uuid(), space_id uuid not null references tpmps.document_spaces(id) on delete restrict, folder_id uuid not null, name text not null check(length(trim(name)) between 1 and 255), size bigint not null check(size between 0 and 50000000), mime_type text not null default 'application/octet-stream', object_key text not null unique default gen_random_uuid()::text, uploaded_by uuid not null default auth.uid() references tpmps.profiles(id) on delete restrict, status text not null default 'pending' check(status in ('pending','ready')), created_at timestamptz not null default now(), foreign key(folder_id,space_id) references tpmps.folders(id,space_id) on delete restrict);
create index profiles_unit on tpmps.profiles(unit_id);
create index spaces_period on tpmps.document_spaces(period_id);
create index spaces_unit on tpmps.document_spaces(unit_id);
create index folders_parent on tpmps.folders(parent_id,space_id);
create index files_folder on tpmps.files(folder_id,space_id);
create index files_space_date on tpmps.files(space_id,created_at desc);
create index files_uploader on tpmps.files(uploaded_by);

create function tpmps_private.active_role() returns text language sql stable security definer set search_path='' as $$ select role from tpmps.profiles where id=auth.uid() and active $$;
create function tpmps_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$ select coalesce(tpmps_private.active_role()='superadmin',false) $$;
create function tpmps_private.can_read(sid uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from tpmps.document_spaces s join tpmps.profiles p on p.id=auth.uid() and p.active where s.id=sid and (p.role in ('superadmin','kepala_sekolah','ketua_tpmps') or (p.role='kepala_unit' and p.unit_id=s.unit_id))) $$;
create function tpmps_private.period_active(pid uuid) returns boolean language sql volatile security definer set search_path='' as $$ select exists(select 1 from tpmps.periods where id=pid and (clock_timestamp() at time zone 'Asia/Jakarta')::date between starts_on and ends_on) $$;
create function tpmps_private.can_write(sid uuid) returns boolean language sql volatile security definer set search_path='' as $$ select exists(select 1 from tpmps.document_spaces s join tpmps.profiles p on p.id=auth.uid() and p.active left join tpmps.units u on u.id=s.unit_id where s.id=sid and tpmps_private.period_active(s.period_id) and (s.unit_id is null or u.active) and (p.role='superadmin' or (p.role='ketua_tpmps' and s.unit_id is null) or (p.role='kepala_unit' and p.unit_id=s.unit_id))) $$;

create function tpmps_private.period_guard() returns trigger language plpgsql set search_path='' as $$ begin
 if TG_OP<>'INSERT' and (clock_timestamp() at time zone 'Asia/Jakarta')::date > old.ends_on then raise exception 'Periode selesai — hanya baca'; end if;
 if TG_OP='UPDATE' and (new.id<>old.id or new.created_at<>old.created_at) then raise exception 'Identitas periode tidak dapat diubah'; end if;
 if TG_OP='DELETE' then return old; end if; return new;
end $$;
create trigger period_guard before update or delete on tpmps.periods for each row execute function tpmps_private.period_guard();

create function tpmps_private.document_guard() returns trigger language plpgsql security definer set search_path='' as $$ declare sid uuid; ancestor uuid; begin
 sid:=case when TG_OP='DELETE' then old.space_id else new.space_id end;
 -- Serialize tree mutations, including competing reparent operations.
 perform 1 from tpmps.document_spaces where id=sid for update;
 if not (TG_OP='INSERT' and TG_TABLE_NAME='folders' and pg_trigger_depth()>1) and not tpmps_private.can_write(sid) then raise exception 'Ruang tidak dapat ditulis atau periode tidak aktif'; end if;
 if TG_OP='DELETE' then
   if TG_TABLE_NAME='files' and pg_trigger_depth()=1 and old.status='ready' then raise exception 'Hapus melalui Storage agar metadata tetap sinkron'; end if;
   return old;
 end if;
 if TG_OP='INSERT' then new.created_at:=clock_timestamp(); end if;
 if TG_OP='UPDATE' then
   if new.id<>old.id or new.space_id<>old.space_id or new.created_at<>old.created_at then raise exception 'Identitas, ruang dan periode tidak dapat diubah'; end if;
 end if;
 if TG_TABLE_NAME='folders' then
   ancestor:=new.parent_id;
   while ancestor is not null loop
     if ancestor=new.id then raise exception 'Siklus folder ditolak'; end if;
     select parent_id into ancestor from tpmps.folders where id=ancestor;
   end loop;
 else
   if TG_OP='INSERT' and (new.uploaded_by is distinct from auth.uid() or new.status<>'pending') then raise exception 'Pengunggah/status tidak valid'; end if;
   if TG_OP='UPDATE' and (new.object_key<>old.object_key or new.uploaded_by<>old.uploaded_by or new.size<>old.size or new.mime_type<>old.mime_type or (new.status<>old.status and pg_trigger_depth()=1)) then raise exception 'Metadata objek tidak dapat diubah langsung'; end if;
 end if;
 return new;
end $$;
create trigger folder_guard before insert or update or delete on tpmps.folders for each row execute function tpmps_private.document_guard();
create trigger file_guard before insert or update or delete on tpmps.files for each row execute function tpmps_private.document_guard();

create function tpmps_private.seed_space() returns trigger language plpgsql security definer set search_path='' as $$ begin
 insert into tpmps.folders(space_id,name) values(new.id,case when new.unit_id is null then 'MM — Manual Mutu' else 'CM — Catatan Mutu' end),(new.id,case when new.unit_id is null then 'PM — Prosedur Mutu' else 'PK — Petunjuk Kerja' end); return new;
end $$;
create trigger seed_space after insert on tpmps.document_spaces for each row execute function tpmps_private.seed_space();
create function tpmps_private.seed_period() returns trigger language plpgsql security definer set search_path='' as $$ begin
 insert into tpmps.document_spaces(period_id,name) values(new.id,'Ketua TPMPS');
 insert into tpmps.document_spaces(period_id,unit_id,name) select new.id,id,name from tpmps.units where active; return new;
end $$;
create trigger seed_period after insert on tpmps.periods for each row execute function tpmps_private.seed_period();
create function tpmps_private.seed_unit() returns trigger language plpgsql security definer set search_path='' as $$ begin
 if new.active then insert into tpmps.document_spaces(period_id,unit_id,name) select id,new.id,new.name from tpmps.periods where ends_on >= (clock_timestamp() at time zone 'Asia/Jakarta')::date on conflict do nothing; end if; return new;
end $$;
create trigger seed_unit after insert or update on tpmps.units for each row execute function tpmps_private.seed_unit();

alter table tpmps.profiles enable row level security;
alter table tpmps.units enable row level security;
alter table tpmps.periods enable row level security;
alter table tpmps.document_spaces enable row level security;
alter table tpmps.folders enable row level security;
alter table tpmps.files enable row level security;
grant select on tpmps.profiles,tpmps.units,tpmps.periods,tpmps.document_spaces,tpmps.folders,tpmps.files to authenticated;
grant insert,update,delete on tpmps.units,tpmps.periods,tpmps.folders,tpmps.files to authenticated;
-- Profile writes are server-only: no self-role/unit escalation.
create policy profiles_read on tpmps.profiles for select to authenticated using(tpmps_private.active_role() is not null and (id=auth.uid() or tpmps_private.is_admin() or exists(select 1 from tpmps.files f where f.uploaded_by=profiles.id and tpmps_private.can_read(f.space_id))));
create policy units_read on tpmps.units for select to authenticated using(tpmps_private.active_role() is not null and (tpmps_private.active_role()<>'kepala_unit' or id=(select p.unit_id from tpmps.profiles p where p.id=auth.uid())));
create policy units_write on tpmps.units for all to authenticated using(tpmps_private.is_admin()) with check(tpmps_private.is_admin());
create policy periods_read on tpmps.periods for select to authenticated using(tpmps_private.active_role() is not null);
create policy periods_write on tpmps.periods for all to authenticated using(tpmps_private.is_admin()) with check(tpmps_private.is_admin());
create policy spaces_read on tpmps.document_spaces for select to authenticated using(tpmps_private.can_read(id));
create policy folders_read on tpmps.folders for select to authenticated using(tpmps_private.can_read(space_id));
create policy folders_insert on tpmps.folders for insert to authenticated with check(tpmps_private.can_write(space_id));
create policy folders_update on tpmps.folders for update to authenticated using(tpmps_private.can_write(space_id)) with check(tpmps_private.can_write(space_id));
create policy folders_delete on tpmps.folders for delete to authenticated using(tpmps_private.can_write(space_id));
create policy files_read on tpmps.files for select to authenticated using(tpmps_private.can_read(space_id));
create policy files_insert on tpmps.files for insert to authenticated with check(tpmps_private.can_write(space_id) and uploaded_by=auth.uid() and status='pending');
create policy files_update on tpmps.files for update to authenticated using(tpmps_private.can_write(space_id)) with check(tpmps_private.can_write(space_id));
create policy files_delete on tpmps.files for delete to authenticated using(tpmps_private.can_write(space_id) and status='pending');

insert into storage.buckets(id,name,public,file_size_limit) values('tpmps-documents','tpmps-documents',false,50000000);
create function tpmps_private.object_read(object_name text) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from tpmps.files where object_key=object_name and status='ready' and tpmps_private.can_read(space_id)) $$;
create function tpmps_private.object_write(object_name text, inserting boolean) returns boolean language sql volatile security definer set search_path='' as $$ select exists(select 1 from tpmps.files where object_key=object_name and tpmps_private.can_write(space_id) and (not inserting or (status='pending' and uploaded_by=auth.uid()))) $$;
create policy tpmps_object_read on storage.objects for select to authenticated using(bucket_id='tpmps-documents' and tpmps_private.object_read(name));
create policy tpmps_object_insert on storage.objects for insert to authenticated with check(bucket_id='tpmps-documents' and tpmps_private.object_write(name,true));
create policy tpmps_object_delete on storage.objects for delete to authenticated using(bucket_id='tpmps-documents' and tpmps_private.object_write(name,false));
-- No UPDATE/upsert policy: object bytes are immutable; a new file needs a new key.
create function tpmps_private.storage_guard() returns trigger language plpgsql security definer set search_path='' as $$ declare f tpmps.files; b text; k text; begin
 b:=case when TG_OP='DELETE' then old.bucket_id else new.bucket_id end;
 if TG_OP='UPDATE' and old.bucket_id='tpmps-documents' then raise exception 'Objek arsip tidak dapat diganti atau dipindah bucket'; end if;
 if b<>'tpmps-documents' then if TG_OP='DELETE' then return old; else return new; end if; end if;
 k:=case when TG_OP='DELETE' then old.name else new.name end;
 select * into f from tpmps.files where object_key=k for update;
 if not found or not tpmps_private.can_write(f.space_id) then raise exception 'Objek ditolak: ruang/periode terkunci'; end if;
 if TG_OP='INSERT' then
   if f.status<>'pending' or f.uploaded_by is distinct from auth.uid() or coalesce((new.metadata->>'size')::bigint,-1)<>f.size or f.size>50000000 then raise exception 'Ukuran/status unggahan tidak valid'; end if;
 elsif TG_OP='UPDATE' then raise exception 'Penggantian objek tidak diizinkan'; end if;
 if TG_OP='DELETE' then return old; else return new; end if;
end $$;
create trigger tpmps_storage_guard before insert or update or delete on storage.objects for each row execute function tpmps_private.storage_guard();
create function tpmps_private.storage_sync() returns trigger language plpgsql security definer set search_path='' as $$ begin
 if TG_OP='INSERT' and new.bucket_id='tpmps-documents' then update tpmps.files set status='ready' where object_key=new.name;
 elsif TG_OP='DELETE' and old.bucket_id='tpmps-documents' then delete from tpmps.files where object_key=old.name; end if;
 if TG_OP='DELETE' then return old; else return new; end if;
end $$;
create trigger tpmps_storage_sync after insert or delete on storage.objects for each row execute function tpmps_private.storage_sync();

create function tpmps.server_clock() returns timestamptz language sql volatile set search_path='' as $$ select clock_timestamp() $$;
revoke all on function tpmps.server_clock() from public;
grant execute on function tpmps.server_clock() to authenticated;
revoke all on all functions in schema tpmps_private from public,anon,authenticated;
grant execute on function tpmps_private.active_role(),tpmps_private.is_admin(),tpmps_private.can_read(uuid),tpmps_private.can_write(uuid),tpmps_private.period_active(uuid),tpmps_private.object_read(text),tpmps_private.object_write(text,boolean) to authenticated;
grant all on all tables in schema tpmps to service_role;
grant execute on function tpmps.server_clock() to service_role;
commit;
