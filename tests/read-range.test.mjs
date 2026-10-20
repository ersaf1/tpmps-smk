import test from 'node:test';
import assert from 'node:assert/strict';
import { ReadableStream } from 'node:stream/web';
import { readFileSlice } from '../apps/shared/read-range.mjs';
const { Response, AbortController } = globalThis;
const file = { url: 'https://storage.example.test/file', headers: { Authorization: 'Bearer test-session', apikey: 'public-test-key' }, size: 50_000_000 };

test('range reads request only the selected section and preserve reader authorization', async () => {
  const blob = await readFileSlice(file, 256000, 512000, new AbortController().signal, () => {}, async (_, options) => {
    assert.equal(options.headers.Range, 'bytes=256000-511999');
    assert.equal(options.headers.Authorization, file.headers.Authorization);
    return new Response('example', { status: 206, headers: { 'content-range': 'bytes 256000-256006/50000000' } });
  });
  assert.equal(await blob.text(), 'example');
});

test('ignored Range responses are cancelled early without buffering the entire file', async () => {
  let cancelled = false;
  let emitted = 0;
  const body = new ReadableStream({ pull(controller) {
    emitted++; controller.enqueue(new Uint8Array(1024).fill(65));
  }, cancel() { cancelled = true; } });
  const blob = await readFileSlice(file, 1024, 3072, new AbortController().signal, () => {}, async () => new Response(body));
  assert.equal(blob.size, 2048);
  assert(cancelled); assert(emitted <= 5);
});

test('incorrect response ranges fail instead of showing the wrong section', async () => {
  await assert.rejects(readFileSlice(file, 256000, 512000, new AbortController().signal, () => {},
    async () => new Response('wrong', { status: 206, headers: { 'content-range': 'bytes 0-4/50000000' } })), /Rentang data/);
});

test('range previews reject denied storage access', async () => {
  await assert.rejects(readFileSlice(file, 0, 16384, new AbortController().signal, () => {},
    async () => new Response('denied', { status: 403 })), /akses ditolak/);
});
