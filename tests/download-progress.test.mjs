import test from 'node:test';
import assert from 'node:assert/strict';
import { readDownload } from '../apps/web/src/read-download.ts';
import { ReadableStream } from 'node:stream/web';
const { AbortController } = globalThis;

test('download progress follows received bytes and finishes only after stream closes', async () => {
  const progress = [];
  const stream = new ReadableStream({ start(controller) {
    controller.enqueue(new Uint8Array([1, 2]));
    controller.enqueue(new Uint8Array([3, 4]));
    controller.close();
  } });
  const blob = await readDownload(stream, 4, 'application/octet-stream',
    (count, percent) => progress.push([count, percent]), new AbortController().signal);
  assert.deepEqual(progress, [[2, 50], [4, 99], [4, 100]]);
  assert.deepEqual([...new Uint8Array(await blob.arrayBuffer())], [1, 2, 3, 4]);
});

test('unknown length reports bytes without inventing a percentage', async () => {
  const progress = [];
  const stream = new ReadableStream({ start(controller) {
    controller.enqueue(new Uint8Array([1, 2])); controller.close();
  } });
  await readDownload(stream, 0, 'application/pdf',
    (count, percent) => progress.push([count, percent]), new AbortController().signal);
  assert.deepEqual(progress, [[2, null], [2, 100]]);
});

test('closing preview cancels pending reads and never reports completion', async () => {
  let cancelled = false;
  const controller = new AbortController();
  const stream = new ReadableStream({ cancel() { cancelled = true; } });
  const progress = [];
  const pending = readDownload(stream, 10, 'text/plain', (_, percent) => progress.push(percent), controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert(cancelled); assert(!progress.includes(100));
});

test('interrupted network streams fail instead of reporting 100 percent', async () => {
  const stream = new ReadableStream({ start(controller) { controller.error(new TypeError('Network failed')); } });
  const progress = [];
  await assert.rejects(readDownload(stream, 10, 'text/plain', (_, percent) => progress.push(percent), new AbortController().signal), /Network failed/);
  assert(!progress.includes(100));
});
