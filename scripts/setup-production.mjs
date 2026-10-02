import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!databaseUrl) throw new Error('DATABASE_URL wajib tersedia di .env. Gunakan connection string dari Supabase Connect.');
if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY wajib tersedia di .env untuk membuat 19 akun Auth.');

const migrationUrl = new URL('../supabase/migrations/20260924033022_simplify_document_management_v2.sql', import.meta.url);
const migration = await readFile(migrationUrl, 'utf8');
const sql = postgres(databaseUrl, {
  ssl: 'require',
  max: 1,
  prepare: false,
  connect_timeout: 20
});

try {
  console.log('Menerapkan schema SINTESA TPMPS v2...');
  await sql.unsafe(migration);
  console.log('Schema v2 berhasil diterapkan.');
} finally {
  await sql.end();
}

console.log('Membuat dan menyinkronkan 19 akun resmi...');
await import('./provision-users.mjs');
console.log('Setup produksi selesai.');
