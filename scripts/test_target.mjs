import fs from 'fs';
import path from 'path';

async function test() {
  const res = await fetch('http://127.0.0.1:9333/json/list');
  const list = await res.json();
  const pageTarget = list.find((item) => item.type === 'page');
  console.log('Page target found:', pageTarget?.title, pageTarget?.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => (ws.onopen = resolve));
  console.log('Connected to WebSocket!');

  let msgId = 0;
  function send(method, params = {}) {
    const id = ++msgId;
    return new Promise((resolve) => {
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  console.log('Page enabled!');

  await send('Page.navigate', { url: 'http://localhost:3000/login' });
  console.log('Navigated to login!');

  await new Promise((r) => setTimeout(r, 2000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  console.log('Screenshot captured, size:', shot.data.length);

  fs.writeFileSync('public/screenshots/presentation/test_login.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_login.png successfully!');

  ws.close();
  process.exit(0);
}

test().catch(console.error);
