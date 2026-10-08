-- Fix Storage RLS policy & triggers so file uploads via Supabase Storage API succeed:
-- 1. Uploader can evaluate RETURNING clause on INSERT into storage.objects while status='pending'
-- 2. storage_guard accommodates can_insert_object dummy validation (which runs before byte length is known)
-- 3. document_guard allows internal cascade triggers at pg_trigger_depth() > 1 (storage_sync)

create or replace function tpmps_private.object_read(object_name text) 
returns boolean 
language sql 
stable 
security definer 
set search_path='' as $$ 
  select exists(
    select 1 from tpmps.files 
    where object_key = object_name 
      and (
        (status = 'ready' and tpmps_private.can_read(space_id)) 
        or 
        (status = 'pending' and uploaded_by = auth.uid() and tpmps_private.can_write(space_id))
      )
  ) 
$$;

create or replace function tpmps_private.document_guard() 
returns trigger 
language plpgsql 
security definer 
set search_path='' as $$ 
declare 
  sid uuid; 
  ancestor uuid; 
begin
 sid := case when TG_OP='DELETE' then old.space_id else new.space_id end;
 -- Serialize tree mutations, including competing reparent operations.
 perform 1 from tpmps.document_spaces where id=sid for update;

 -- Direct client operations (pg_trigger_depth() = 1) must be authorized via can_write(sid).
 -- Internal cascades from storage_sync or seed triggers (pg_trigger_depth() > 1) are permitted.
 if pg_trigger_depth() = 1 
    and not (session_user in ('supabase_storage_admin', 'postgres') or auth.role() = 'service_role')
    and not tpmps_private.can_write(sid) then 
   raise exception 'Ruang tidak dapat ditulis atau periode tidak aktif'; 
 end if;

 if TG_OP='DELETE' then
   if TG_TABLE_NAME='files' and pg_trigger_depth()=1 and old.status='ready' then 
     raise exception 'Hapus melalui Storage agar metadata tetap sinkron'; 
   end if;
   return old;
 end if;
 if TG_OP='INSERT' then 
   new.created_at:=clock_timestamp(); 
 end if;
 if TG_OP='UPDATE' then
   if new.id<>old.id or new.space_id<>old.space_id or new.created_at<>old.created_at then 
     raise exception 'Identitas, ruang dan periode tidak dapat diubah'; 
   end if;
 end if;
 if TG_TABLE_NAME='folders' then
   ancestor:=new.parent_id;
   while ancestor is not null loop
     if ancestor=new.id then 
       raise exception 'Siklus folder ditolak'; 
     end if;
     select parent_id into ancestor from tpmps.folders where id=ancestor;
   end loop;
 else
   if TG_OP='INSERT' and (new.uploaded_by is distinct from auth.uid() or new.status<>'pending') then 
     raise exception 'Pengunggah/status tidak valid'; 
   end if;
   if TG_OP='UPDATE' and (new.object_key<>old.object_key or new.uploaded_by<>old.uploaded_by or new.size<>old.size or new.mime_type<>old.mime_type or (new.status<>old.status and pg_trigger_depth()=1)) then 
     raise exception 'Metadata objek tidak dapat diubah langsung'; 
   end if;
 end if;
 return new;
end $$;

create or replace function tpmps_private.storage_guard() 
returns trigger 
language plpgsql 
security definer 
set search_path='' as $$ 
declare 
  f tpmps.files; 
  b text; 
  k text; 
  pid uuid;
begin
 b := case when TG_OP='DELETE' then old.bucket_id else new.bucket_id end;
 if TG_OP='UPDATE' and old.bucket_id='tpmps-documents' then 
   raise exception 'Objek arsip tidak dapat diganti atau dipindah bucket'; 
 end if;
 if b<>'tpmps-documents' then 
   if TG_OP='DELETE' then return old; else return new; end if; 
 end if;
 k := case when TG_OP='DELETE' then old.name else new.name end;
 select * into f from tpmps.files where object_key=k for update;
 if not found then 
   raise exception 'Objek ditolak: arsip tidak terdaftar'; 
 end if;
 select period_id into pid from tpmps.document_spaces where id=f.space_id;
 if not tpmps_private.period_active(pid) then 
   raise exception 'Objek ditolak: periode tidak aktif'; 
 end if;
 if TG_OP='INSERT' then
   if f.status<>'pending' 
      or (auth.uid() is not null and f.uploaded_by is distinct from auth.uid()) 
      or f.size>50000000 then 
     raise exception 'Ukuran/status unggahan tidak valid'; 
   end if;
   -- Validate size if metadata has size (in final insert)
   if (new.metadata->>'size') is not null and ((new.metadata->>'size')::bigint <> f.size or (new.metadata->>'size')::bigint > 50000000) then
     raise exception 'Ukuran objek tidak sesuai metadata';
   end if;
 elsif TG_OP='UPDATE' then 
   raise exception 'Penggantian objek tidak diizinkan'; 
 elsif TG_OP='DELETE' then
   if not (session_user in ('supabase_storage_admin', 'postgres') or auth.role() = 'service_role' or tpmps_private.can_write(f.space_id)) then
     raise exception 'Objek ditolak: izin hapus tidak sah';
   end if;
   return old;
 end if;
 return new;
end $$;
