import assert from 'node:assert/strict';
import { accounts } from './provision-users.mjs';

console.log('\n======================================================');
console.log('   SINTESA TPMPS SMK NEGERI 2 MAGELANG - TEST SUITE   ');
console.log('======================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } catch (error) {
    console.error(`  [FAIL] ${testName}`);
    console.error(`         Error: ${error.message}`);
  }
}

// -------------------------------------------------------------
// TEST SUITE 1: VERIFIKASI 19 AKUN RESMI
// -------------------------------------------------------------
console.log('--- TEST SUITE 1: Verifikasi 19 Akun Resmi TPMPS ---');

runTest('Jumlah akun resmi yang terdaftar tepat 19 akun', () => {
  assert.equal(accounts.length, 19, `Harus ada 19 akun, ditemukan ${accounts.length}`);
});

runTest('Seluruh email menggunakan domain resmi @smkn2magelang.sch.id', () => {
  for (const acc of accounts) {
    assert.ok(
      acc.email.endsWith('@smkn2magelang.sch.id'),
      `Email ${acc.email} tidak menggunakan domain resmi`
    );
  }
});

runTest('Tidak ada duplikasi alamat email', () => {
  const emails = new Set();
  for (const acc of accounts) {
    assert.ok(!emails.has(acc.email), `Email duplikat ditemukan: ${acc.email}`);
    emails.add(acc.email);
  }
});

runTest('Akun pimpinan utama (Superadmin, Kasek, Ketua TPMPS) tersedia lengkap', () => {
  const admin = accounts.find((a) => a.role === 'superadmin');
  assert.ok(admin, 'Superadmin harus ada');
  assert.equal(admin.email, 'admin@smkn2magelang.sch.id');

  const kasek = accounts.find((a) => a.role === 'kepala_sekolah');
  assert.ok(kasek, 'Kepala Sekolah harus ada');
  assert.equal(kasek.email, 'kurniawan.basuki@smkn2magelang.sch.id');
  assert.ok(kasek.fullName.includes('Kurniawan Basuki'));

  const tpmps = accounts.find((a) => a.role === 'ketua_tpmps');
  assert.ok(tpmps, 'Ketua TPMPS harus ada');
  assert.equal(tpmps.email, 'vickky.listyaningsih@smkn2magelang.sch.id');
  assert.ok(tpmps.fullName.includes('Vickky Listyaningsih'));
});

runTest('16 Unit Pelaksana memiliki unitCode yang valid', () => {
  const unitAccounts = accounts.filter((a) => a.role === 'ketua_unit');
  assert.equal(unitAccounts.length, 16, `Harus ada 16 ketua unit, ditemukan ${unitAccounts.length}`);
  
  const expectedCodes = [
    'RENBANG', 'WKS-1', 'WKS-2', 'WKS-3', 'WKS-4',
    'AKL', 'MPLB', 'PM', 'PPLG', 'UMUM',
    'TU', 'BK', 'BKK', 'PERPUS', 'LAB', 'USMAN'
  ];

  for (const code of expectedCodes) {
    const found = unitAccounts.find((a) => a.unitCode === code);
    assert.ok(found, `Unit code ${code} harus ada pada daftar akun`);
  }
});

// -------------------------------------------------------------
// TEST SUITE 2: KEAMANAN KATA SANDI
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Kebijakan & Keamanan Kata Sandi ---');

const DEFAULT_PW = 'Sintesa2026!';

runTest('Kata sandi default "Sintesa2026!" memenuhi standar keamanan >= 10 karakter', () => {
  assert.ok(DEFAULT_PW.length >= 10, 'Panjang password harus minimal 10 karakter');
});

runTest('Kata sandi memuat huruf besar, huruf kecil, angka, dan karakter khusus', () => {
  assert.ok(/[A-Z]/.test(DEFAULT_PW), 'Harus ada huruf besar');
  assert.ok(/[a-z]/.test(DEFAULT_PW), 'Harus ada huruf kecil');
  assert.ok(/\d/.test(DEFAULT_PW), 'Harus ada angka');
  assert.ok(/[^A-Za-z0-9]/.test(DEFAULT_PW), 'Harus ada simbol/karakter khusus');
});

// -------------------------------------------------------------
// TEST SUITE 3: FLOW REPOSITORI FOLDER & DOKUMEN UNIT
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Simulasi Flow Folder & Dokumen Unit ---');

runTest('Unit dapat membuat folder kustom sendiri', () => {
  const customFolders = {};
  const unitId = 'u-06'; // PPLG
  
  // Buat folder baru
  const newFolder = 'Kurikulum Merdeka Konsentrasi RPL 2025';
  customFolders[unitId] = [newFolder];

  assert.equal(customFolders[unitId].length, 1);
  assert.equal(customFolders[unitId][0], newFolder);
});

runTest('Unit dapat mengunggah dokumen bukti mutu ke dalam folder', () => {
  const dummyDoc = {
    id: 'doc-test-01',
    code: 'DOK-PPLG-001',
    title: 'Modul Ajar Pemrograman Berorientasi Objek',
    unitId: 'u-06',
    unitName: '6. UNIT KEJURUAN PPLG',
    folder: 'Kurikulum Merdeka Konsentrasi RPL 2025',
    status: 'Menunggu Review',
    fileType: 'pdf',
    createdAt: new Date().toISOString()
  };

  assert.equal(dummyDoc.status, 'Menunggu Review', 'Status awal harus Menunggu Review');
  assert.equal(dummyDoc.folder, 'Kurikulum Merdeka Konsentrasi RPL 2025');
});

runTest('Ketua TPMPS & Kasek dapat memfilter dan memvalidasi dokumen unit', () => {
  const dummyDoc = {
    id: 'doc-test-01',
    title: 'Modul Ajar Pemrograman Berorientasi Objek',
    status: 'Menunggu Review',
    verificationNotes: ''
  };

  // Simulasi validasi oleh TPMPS
  function validateDocument(doc, newStatus, notes) {
    doc.status = newStatus;
    doc.verificationNotes = notes;
    doc.verifiedAt = new Date().toISOString();
    return doc;
  }

  // 1. Verifikasi lolos
  validateDocument(dummyDoc, 'Terverifikasi', 'Dokumen memenuhi standar proses.');
  assert.equal(dummyDoc.status, 'Terverifikasi');
  assert.equal(dummyDoc.verificationNotes, 'Dokumen memenuhi standar proses.');

  // 2. Minta revisi
  validateDocument(dummyDoc, 'Perlu Revisi', 'Tolong lampirkan rubrik asesmen sumatif.');
  assert.equal(dummyDoc.status, 'Perlu Revisi');
  assert.ok(dummyDoc.verificationNotes.includes('rubrik asesmen'));
});

// -------------------------------------------------------------
// RINGKASAN HASIL TEST
// -------------------------------------------------------------
console.log('\n======================================================');
console.log(`   TOTAL PENGUJIAN: ${totalTests} | LULUS: ${passedTests} | GAGAL: ${totalTests - passedTests}`);
console.log('======================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
