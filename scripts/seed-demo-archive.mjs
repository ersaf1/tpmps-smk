import { createClient } from '@supabase/supabase-js';

const dryRun = process.argv.includes('--dry-run');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const folderPlan = [
  { key: 'tpmps', name: 'Contoh Arsip TPMPS', parent: null, scope: 'tpmps', kind: null },
  { key: 'manual', name: 'Manual Mutu', parent: 'tpmps', scope: 'tpmps', kind: 'manual_mutu' },
  { key: 'rencana', name: 'Rencana Kerja', parent: 'manual', scope: 'tpmps', kind: 'manual_mutu' },
  { key: 'prosedur', name: 'Prosedur Mutu', parent: 'tpmps', scope: 'tpmps', kind: 'prosedur_mutu' },
  { key: 'audit', name: 'Audit Internal', parent: 'prosedur', scope: 'tpmps', kind: 'prosedur_mutu' },
  { key: 'unit', name: 'Contoh Arsip Unit', parent: null, scope: 'unit', kind: null },
  { key: 'petunjuk', name: 'Petunjuk Kerja', parent: 'unit', scope: 'unit', kind: 'petunjuk_kerja' },
  { key: 'praktikum', name: 'Praktikum', parent: 'petunjuk', scope: 'unit', kind: 'petunjuk_kerja' },
  { key: 'catatan', name: 'Catatan Mutu', parent: 'unit', scope: 'unit', kind: 'catatan_mutu' },
];

const documents = [
  { folder: 'manual', filename: 'Kebijakan-Mutu-Contoh.pdf', title: 'Kebijakan Mutu - Contoh', lines: ['Dokumen contoh untuk simulasi arsip TPMPS.', 'Sekolah berkomitmen meninjau mutu pembelajaran secara berkala.', 'Seluruh isi dokumen ini adalah data dummy.'] },
  { folder: 'rencana', filename: 'Sasaran-Mutu-Contoh.csv', csv: 'indikator,target,status\nKehadiran peserta didik,95%,Contoh\nKelengkapan dokumen unit,100%,Contoh\nTindak lanjut audit,90%,Contoh\n' },
  { folder: 'audit', filename: 'SOP-Audit-Internal-Contoh.pdf', title: 'SOP Audit Internal - Contoh', lines: ['1. Susun jadwal audit dan daftar periksa.', '2. Periksa bukti dari setiap unit kerja.', '3. Catat temuan dan rencana tindak lanjut.', 'Dokumen contoh - bukan prosedur resmi sekolah.'] },
  { folder: 'audit', filename: 'Checklist-Audit-Contoh.csv', csv: 'nomor,aspek,hasil,catatan\n1,Kelengkapan arsip,Contoh,Data dummy\n2,Pengesahan dokumen,Contoh,Data dummy\n3,Tindak lanjut,Contoh,Data dummy\n' },
  { folder: 'praktikum', filename: 'Petunjuk-Praktikum-Contoh.pdf', title: 'Petunjuk Praktikum - Contoh', lines: ['Siapkan alat dan bahan sesuai arahan guru.', 'Ikuti prosedur keselamatan kerja di ruang praktik.', 'Catat hasil pengamatan pada lembar kerja.', 'Dokumen ini hanya contoh untuk uji arsip.'] },
  { folder: 'catatan', filename: 'Log-Kegiatan-Contoh.csv', csv: 'tanggal,kegiatan,penanggung_jawab\n2026-09-01,Pemeriksaan kelengkapan dokumen,Petugas contoh\n2026-09-08,Tinjauan catatan mutu,Petugas contoh\n' },
];

function pdfBuffer(title, lines) {
  const escape = (text) => text.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
  const content = ['BT', '/F1 18 Tf', '50 790 Td', `(${escape(title)}) Tj`, '/F1 11 Tf', ...lines.flatMap((line) => ['0 -30 Td', `(${escape(line)}) Tj`]), 'ET'].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];
  let output = '%PDF-1.4\n';
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(output));
    output += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(output);
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) output += `${String(offset).padStart(10, '0')} 00000 n \n`;
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(output);
}

if (dryRun) {
  console.log('Folder:', folderPlan.map((folder) => `${folder.parent ?? 'akar'} / ${folder.name}`).join(' | '));
  console.log('File:', documents.map((document) => `${document.folder}/${document.filename}`).join(' | '));
  process.exit(0);
}

if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia di .env.');
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const get = async (query, label) => {
  const { data, error } = await query;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
};

const [period, admin, unit] = await Promise.all([
  get(supabase.from('periods').select('id, name').eq('is_active', true).maybeSingle(), 'Periode aktif'),
  get(supabase.from('profiles').select('id').eq('role', 'superadmin').eq('is_active', true).limit(1).maybeSingle(), 'Profil superadmin'),
  get(supabase.from('document_units').select('id, code').eq('is_active', true).order('sort_order').limit(1).maybeSingle(), 'Unit kerja'),
]);
if (!period || !admin || !unit) throw new Error('Periode aktif, superadmin aktif, dan minimal satu unit kerja harus tersedia.');

const folderIds = new Map();
for (const folder of folderPlan) {
  const parentId = folder.parent ? folderIds.get(folder.parent) : null;
  const unitId = folder.scope === 'unit' ? unit.id : null;
  const name = folder.key === 'unit' ? `${folder.name} - ${unit.code}` : folder.name;
  let query = supabase.from('folders').select('id').eq('period_id', period.id).eq('name', name).eq('scope', folder.scope).is('deleted_at', null);
  query = parentId ? query.eq('parent_id', parentId) : query.is('parent_id', null);
  query = unitId ? query.eq('unit_id', unitId) : query.is('unit_id', null);
  let existing = await get(query.maybeSingle(), `Cari folder ${name}`);
  if (!existing) existing = await get(supabase.from('folders').insert({ period_id: period.id, parent_id: parentId, unit_id: unitId, scope: folder.scope, document_kind: folder.kind, name, created_by: admin.id }).select('id').single(), `Buat folder ${name}`);
  folderIds.set(folder.key, existing.id);
  console.log(`Folder siap: ${name}`);
}

for (const document of documents) {
  const storagePath = `${admin.id}/contoh-arsip/${period.id}/${document.filename}`;
  const body = document.csv ? Buffer.from(`\uFEFF${document.csv}`, 'utf8') : pdfBuffer(document.title, document.lines);
  const mimeType = document.csv ? 'text/csv' : 'application/pdf';
  const existing = await get(supabase.from('file_entries').select('id').eq('storage_path', storagePath).maybeSingle(), `Cari file ${document.filename}`);
  const stored = await get(supabase.storage.from('documents').exists(storagePath), `Cek Storage ${document.filename}`);
  if (!stored) await get(supabase.storage.from('documents').upload(storagePath, body, { contentType: mimeType, upsert: false }), `Unggah ${document.filename}`);
  if (!existing) await get(supabase.from('file_entries').insert({ folder_id: folderIds.get(document.folder), storage_path: storagePath, original_name: document.filename, mime_type: mimeType, size_bytes: body.byteLength, created_by: admin.id }).select('id').single(), `Catat ${document.filename}`);
  console.log(`File siap: ${document.filename}`);
}

console.log(`Selesai: ${folderPlan.length} folder dan ${documents.length} file contoh pada periode ${period.name}.`);
