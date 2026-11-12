import fs from 'fs';

async function main() {
  const res = await fetch('http://localhost:9222/json');
  const tabs = await res.json();
  const pageTab = tabs.find(t => t.url && (t.url.includes('5173') || t.url.includes('og-template')));
  if (!pageTab) {
    console.log('No tab found');
    return;
  }
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  ws.onopen = async () => {
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: 'file:///d:/3dportfolio/public/og-template.html' });
    await new Promise((r) => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('public/og-image.png', Buffer.from(shot.data, 'base64'));
    console.log('✓ Successfully saved public/og-image.png (1200x630)');
    process.exit(0);
  };
}

main().catch(console.error);

