import { access, mkdtemp, mkdir, readFile, writeFile, rm, stat, cp } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawn, execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve, join, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { OFFICE_EXTENSIONS } from '../../shared/preview.mjs';

export class PreviewError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export async function findConverter() {
  const candidates = [process.env.LIBREOFFICE_PATH,
    resolve(process.cwd(), '.tools/libreoffice/program/soffice.com'),
    resolve(process.cwd(), '../../.tools/libreoffice/program/soffice.com'),
    'C:/Program Files/LibreOffice/program/soffice.com',
    '/usr/bin/libreoffice', '/usr/bin/soffice',
    '/Applications/LibreOffice.app/Contents/MacOS/soffice'].filter(Boolean);
  for (const config of [resolve(process.cwd(), '.tools/preview-runtime.json'), resolve(process.cwd(), '../../.tools/preview-runtime.json')]) {
    try {
      const settings = JSON.parse((await readFile(/* turbopackIgnore: true */ config, 'utf8')).replace(/^\uFEFF/, ''));
      if (typeof settings.executable === 'string') candidates.unshift(settings.executable);
    } catch { /* optional project-local runtime */ }
  }
  for (const candidate of candidates) {
    try { await access(candidate, constants.X_OK); return candidate; } catch { /* next location */ }
  }
  throw new PreviewError(503, 'Pratinjau Office belum tersedia. Hubungi pengelola aplikasi untuk mengaktifkannya.');
}

// Bound conversion work per server process; no shared document cache or public URLs.
let active = 0;
const cache = new Map();
const CACHE_LIMIT = 20_000_000;
async function cleanup(workspace) {
  const target = resolve(workspace);
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith('sintesa-preview-')) {
    throw new Error('Unexpected conversion cleanup path');
  }
  await rm(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
}
export async function convertOffice(data, extension, signal) {
  if (!OFFICE_EXTENSIONS.has(extension)) throw new PreviewError(415, 'Format dokumen tidak sesuai.');
  if (data.byteLength > 50_000_000) throw new PreviewError(413, 'Ukuran dokumen melebihi 50 MB.');
  if (signal?.aborted) throw new PreviewError(499, 'Pratinjau dibatalkan.');
  // Called only after the route has authenticated and downloaded through caller RLS.
  // Cache is private process memory; the route rechecks access before every response.
  const key = `${extension}:${createHash('sha256').update(data).digest('hex')}`;
  for (const [key, entry] of cache) if (entry.expires < Date.now()) cache.delete(key);
  if (cache.has(key)) return cache.get(key).pdf;
  if (active >= 2) throw new PreviewError(429, 'Mesin pratinjau sedang sibuk. Coba lagi sebentar.');
  active++;
  let workspace;
  try {
    const executable = await findConverter();
    workspace = await mkdtemp(join(tmpdir(), 'sintesa-preview-'));
    const profile = join(workspace, 'profile');
    const templates = [resolve(process.cwd(), '.tools/preview-profile'), resolve(process.cwd(), '../../.tools/preview-profile')];
    for (const template of templates) {
      try {
        await access(join(template, 'user/registrymodifications.xcu'));
        await cp(/* turbopackIgnore: true */ template, profile, {recursive:true,filter: path => !path.endsWith('.lock')});
        break;
      } catch { /* first initialization or a system LibreOffice installation */ }
    }
    await mkdir(join(profile, 'user'), { recursive: true });
    // A separate profile for every document: no macros, no trust in supplied documents.
    await writeFile(join(profile, 'user', 'registrymodifications.xcu'), `<?xml version="1.0"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry">
<item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="MacroSecurityLevel" oor:op="fuse"><value>3</value></prop><prop oor:name="DisableMacrosExecution" oor:op="fuse"><value>true</value></prop><prop oor:name="DisableActiveContent" oor:op="fuse"><value>true</value></prop><prop oor:name="BlockUntrustedRefererLinks" oor:op="fuse"><value>true</value></prop></item>
<item oor:path="/org.openoffice.Office.Writer/Content/Update"><prop oor:name="Link" oor:op="fuse"><value>0</value></prop></item>
<item oor:path="/org.openoffice.Office.Calc/Content/Update"><prop oor:name="Link" oor:op="fuse"><value>1</value></prop></item>
</oor:items>`);
    const input = join(workspace, `document.${extension}`);
    await writeFile(input, data);
    await new Promise((resolveRun, reject) => {
      const child = spawn(/* turbopackIgnore: true */ executable, [
        `-env:UserInstallation=${pathToFileURL(profile).href}`,
        '--headless', '--nologo', '--nodefault', '--norestore',
        '--convert-to', 'pdf', '--outdir', workspace, input,
      ], { windowsHide: true, detached: process.platform !== 'win32', stdio: ['ignore', 'ignore', 'ignore'] });
      let reason;
      function stop(message) {
        reason = new PreviewError(422, message);
        if (!child.pid) return;
        if (process.platform === 'win32') {
          execFile('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true }, () => {});
        } else {
          try { process.kill(-child.pid, 'SIGKILL'); } catch { /* process already exited */ }
        }
      }
      const timer = setTimeout(() => stop('Mesin pratinjau belum menyelesaikan dokumen. Coba lagi atau periksa apakah file dilindungi kata sandi.'), 180_000);
      const abort = () => stop('Pratinjau dibatalkan.');
      signal?.addEventListener('abort', abort, { once: true });
      if (signal?.aborted) abort();
      child.once('error', error => { clearTimeout(timer); signal?.removeEventListener('abort', abort); reject(error); });
      child.once('close', code => {
        clearTimeout(timer); signal?.removeEventListener('abort', abort);
        if (reason) reject(reason);
        else if (code !== 0) reject(new PreviewError(422, 'Dokumen tidak dapat dikonversi. Periksa apakah file rusak atau dilindungi kata sandi.'));
        else resolveRun();
      });
    });
    const output = join(workspace, 'document.pdf');
    const info = await stat(output).catch(() => null);
    if (!info || info.size < 5 || info.size > 100_000_000) {
      throw new PreviewError(422, 'Pratinjau tidak dapat dibuat. File mungkin rusak, terenkripsi, atau terlalu besar.');
    }
    const result = await readFile(output);
    if (result.subarray(0, 5).toString() !== '%PDF-') throw new PreviewError(422, 'Hasil konversi tidak valid.');
    if (result.byteLength <= CACHE_LIMIT) {
      let used = [...cache.values()].reduce((total, entry) => total + entry.pdf.byteLength, 0);
      while (used + result.byteLength > CACHE_LIMIT && cache.size) {
        const oldest = cache.keys().next().value;
        used -= cache.get(oldest).pdf.byteLength;
        cache.delete(oldest);
      }
      cache.set(key, {pdf:result,expires:Date.now() + 5 * 60_000});
    }
    return result;
  } finally {
    active--;
    if (workspace) await cleanup(workspace);
  }
}
