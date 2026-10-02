import pg from 'pg';
import {readFileSync} from 'node:fs';
if(!process.env.DATABASE_URL)throw new Error('Isi DATABASE_URL dengan connection string Session pooler Supabase.');
const client=new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:15000});
try{await client.connect();const {rows}=await client.query("select to_regnamespace('tpmps') is not null as installed");if(rows[0].installed)throw new Error('Schema tpmps sudah ada. Migrasi tidak dijalankan ulang.');await client.query(readFileSync('supabase/migrations/20261002045742_archive_security.sql','utf8'));console.log('Migrasi TPMPS berhasil. Tambahkan tpmps ke Exposed schemas di Data API.');}catch(error){await client.query('rollback').catch(()=>{});console.error(error.code?`Migrasi gagal (${error.code}). Periksa koneksi atau konflik schema; transaksi dibatalkan.`:error.message);process.exitCode=1;}finally{await client.end();}
