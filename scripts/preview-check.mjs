import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn, execFile } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { findConverter } from '../apps/api/lib/convert-preview.mjs';

const formats = [
  ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2],
  ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 3],
  ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 2],
  ['rtf', 'application/rtf', 1],
  ['doc', 'application/msword', 2], ['ppt', 'application/vnd.ms-powerpoint', 3], ['xls', 'application/vnd.ms-excel', 2],
];
const executable = await findConverter();
await mkdir('artifacts/office-preview', { recursive: true });
await mkdir('artifacts/legacy-fixtures', { recursive: true });
// Generate genuine legacy Office files from the small, checked-in modern test files.
for (const [source, extension] of [['docx','doc'],['pptx','ppt'],['xlsx','xls']]) {
  console.log(`Preparing legacy ${extension}`);
  if ((await import('node:fs')).existsSync(`artifacts/legacy-fixtures/test.${extension}`)) continue;
  const profile = resolve(`artifacts/legacy-fixtures/profile-${extension}`);
  const { pathToFileURL } = await import('node:url');
  await new Promise((done, reject) => {
    const legacyProcess = spawn(executable, [`-env:UserInstallation=${pathToFileURL(profile).href}`,
      '--headless', '--nologo', '--norestore', '--convert-to', extension,
      '--outdir', resolve('artifacts/legacy-fixtures'), resolve(`tests/fixtures/test.${source}`)], {windowsHide:true,stdio:'ignore'});
    legacyProcess.on('error',reject); legacyProcess.on('close',code => code === 0 ? done() : reject(new Error(`Legacy fixture ${extension} failed`)));
  });
}
const userId = '10000000-0000-4000-8000-000000000099';
const records = new Map(await Promise.all(formats.map(async ([extension, mime, pages], i) => {
  const id = `10000000-0000-4000-8000-${String(i + 1).padStart(12,'0')}`;
  const content = await readFile(`${i >= 4 ? 'artifacts/legacy-fixtures' : 'tests/fixtures'}/test.${extension}`);
  return [id, {id,name:`test.${extension}`,mime_type:mime,object_key:`private-${extension}`,size:content.length,status:'ready',content,pages}];
})));
const requests = [];
const mock = createServer((request,response) => {
  const url = new URL(request.url, 'http://test');
  const token = request.headers.authorization?.replace('Bearer ','');
  requests.push({path:url.pathname, token, schema:request.headers['accept-profile']});
  const send = (value,status=200) => {response.writeHead(status,{'Content-Type':'application/json'});response.end(JSON.stringify(value));};
  if (url.pathname === '/auth/v1/user') {
    if (token === 'invalid') return send({message:'Invalid token'},401);
    return send({id:userId,email:'reader@example.test',aud:'authenticated',role:'authenticated'});
  }
  if (url.pathname === '/rest/v1/profiles') return send({id:userId,active:token !== 'inactive',
    role:token === 'unit' ? 'kepala_unit' : token === 'chair' ? 'ketua_tpmps' : token === 'admin' ? 'superadmin' : 'kepala_sekolah'});
  if (url.pathname === '/rest/v1/files') {
    if (token === 'denied') return send({message:'No accessible row'},404);
    const row = records.get(url.searchParams.get('id')?.replace('eq.',''));
    if (!row) return send({message:'Not found'},404);
    const metadata = {...row};
    delete metadata.content; delete metadata.pages;
    return send(request.headers.accept?.includes('object+json') ? metadata : [metadata]);
  }
  if (url.pathname.includes('/storage/v1/object/')) {
    if (token === 'storage-denied') return send({message:'Forbidden'},403);
    const row = [...records.values()].find(row => url.pathname.endsWith(row.object_key));
    if (!row) return send({message:'Missing'},404);
    response.writeHead(200,{'Content-Type':row.mime_type}); return response.end(row.content);
  }
  send({message:'Unknown mock route'},404);
});
await new Promise(done => mock.listen(0,'127.0.0.1',done));
const probe = createServer();
await new Promise(done => probe.listen(0,'127.0.0.1',done));
const port = probe.address().port;
await new Promise(done => probe.close(done));
const server = spawn(process.execPath,['node_modules/next/dist/bin/next','start','apps/api','-p',String(port)],{
  windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,SUPABASE_URL:`http://127.0.0.1:${mock.address().port}`,
    SUPABASE_PUBLISHABLE_KEY:'test-publishable-key',SUPABASE_SECRET_KEY:'',SUPABASE_SERVICE_ROLE_KEY:'',LIBREOFFICE_PATH:executable},
});
let startupLog = '';
server.stdout.on('data', data => startupLog = (startupLog + data).slice(-6000));
server.stderr.on('data', data => startupLog = (startupLog + data).slice(-6000));
const base = `http://127.0.0.1:${port}`;
try {
  for (let attempt=0;attempt<160;attempt++) {
    try { if ((await fetch(`${base}/api/health`)).ok) break; } catch { /* server starting */ }
    if (attempt === 159) throw new Error(`Preview API test server did not start: ${startupLog}`);
    await new Promise(done => setTimeout(done,250));
  }
  const firstId = records.keys().next().value;
  for (const [token, status] of [[null,401],['invalid',401],['inactive',403],['denied',404],['storage-denied',403]]) {
    const response = await fetch(`${base}/api/preview?id=${firstId}`,{headers:token ? {Authorization:`Bearer ${token}`} : {}});
    assert.equal(response.status,status,`access ${token}`);
    assert(response.headers.get('content-type').includes('json'));
    assert(response.headers.get('cache-control').includes('no-store'));
  }
  for (const record of records.values()) {
    const response = await fetch(`${base}/api/preview?id=${record.id}`,{headers:{Authorization:'Bearer school'}});
    assert.equal(response.status,200,`${record.name}: ${response.status === 200 ? '' : await response.text()}`);
    assert.equal(response.headers.get('content-type'),'application/pdf');
    assert(response.headers.get('cache-control').includes('no-store'));
    const pdf = new Uint8Array(await response.arrayBuffer());
    await writeFile(`artifacts/office-preview/${record.name}.pdf`,pdf);
    const task = getDocument({data:pdf,useSystemFonts:true});
    const document = await task.promise;
    assert(document.numPages >= record.pages,`${record.name}: pages`);
    let words = '';
    for (let page=1;page<=document.numPages;page++) words += (await (await document.getPage(page)).getTextContent()).items.map(item=>item.str || '').join(' ');
    assert(words.replace(/\s+/g,' ').includes(record.name.includes('xls') ? 'Jumlah' : 'SINTESA'),`${record.name}: actual content`);
    await task.destroy();
    console.log(`${record.name}: authenticated conversion, ${document.numPages} pages, content verified`);
  }
  for (const token of ['unit','chair','admin']) {
    assert.equal((await fetch(`${base}/api/preview?id=${firstId}`,{headers:{Authorization:`Bearer ${token}`}})).status,200,token);
  }
  // A warm conversion cache must never skip reader or Storage permission checks.
  for (const [token,status] of [['inactive',403],['denied',404],['storage-denied',403]]) {
    assert.equal((await fetch(`${base}/api/preview?id=${firstId}`,{headers:{Authorization:`Bearer ${token}`}})).status,status,`cached access ${token}`);
  }
  assert(requests.filter(request=>request.path.startsWith('/rest/v1/')).every(request=>request.schema === 'tpmps'));
  assert(requests.filter(request=>request.path.includes('/storage/v1/object/')).every(request=>['school','unit','chair','admin','storage-denied'].includes(request.token)));
  console.log('Office preview API: real modern/legacy conversion, all four readers, rejected sessions/metadata/storage, caller JWT and private/no-store responses passed (isolated test transport).');
} finally {
  if (process.platform === 'win32') await new Promise(done=>execFile('taskkill',['/pid',String(server.pid),'/t','/f'],{windowsHide:true},()=>done()));
  else server.kill('SIGTERM');
  await new Promise(done=>mock.close(done));
}
