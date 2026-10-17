// Records the Kumi app (localhost:3000) stepping through its window sizes in real time (CDP screencast), for the
// Kumi case study's size section (Oct 17, 2026): landscape S, M, L, then portrait L, M, S, then back to landscape S
// so the video loops. Writes frames/NNNNN.jpg, frames.json (timestamps), marks.json (when each size was picked)
// and rect.json (the union of the window's boxes).   node rec_sizes.mjs <outDir> [holdMs]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
const [out, hold = '1700'] = process.argv.slice(2);
rmSync(out, { recursive: true, force: true }); mkdirSync(join(out, 'frames'), { recursive: true });
const W = 1440, H = 900, PORT = 9391;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${resolve(out, 'prof')}`, `--window-size=${W},${H}`, '--hide-scrollbars', `--force-device-scale-factor=${process.env.DPR || 1}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets; for (let i = 0; i < 150; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0, rec = false; const pend = new Map(), frames = [], marks = [];
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
  if (m.method === 'Page.screencastFrame') {
    if (rec) { writeFileSync(join(out, 'frames', String(frames.length).padStart(5, '0') + '.jpg'), Buffer.from(m.params.data, 'base64')); frames.push(m.params.metadata.timestamp); }
    ws.send(JSON.stringify({ id: ++id, method: 'Page.screencastFrameAck', params: { sessionId: m.params.sessionId } }));
  }
});
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.value;
const click = (label) => ev(`(() => { const b = document.querySelector('button[aria-label="${label}"]'); if (!b) return 'missing ${label}'; b.click(); return 'ok'; })()`);
const box = () => ev(`(() => { const r = document.querySelector('.kumi-window').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; })()`);
await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: +(process.env.DPR || 1), mobile: false });
await send('Page.navigate', { url: 'http://localhost:3000/?at=13:18' });
await sleep(6000);
console.log('start', await click('Window: landscape'), await click('Window: small, 6 columns'));
await sleep(2500);
const steps = [
  ['Window: medium, 8 columns'], ['Window: large, 10 columns'],
  ['Window: portrait'], ['Window: medium, 4 columns'], ['Window: small, 3 columns'],
  ['Window: landscape'],
];
const boxes = [await box()];
await send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W * (+(process.env.DPR || 1)), maxHeight: H * (+(process.env.DPR || 1)), everyNthFrame: 1 });
await sleep(300); rec = true; const t0 = Date.now();
await sleep(+hold);
for (const [label] of steps) {
  marks.push([label, (Date.now() - t0) / 1000]); console.log(label, await click(label));
  await sleep(+hold); boxes.push(await box());
}
const tEnd = (Date.now() - t0) / 1000; rec = false; await send('Page.stopScreencast');
const u = boxes.reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]);
writeFileSync(join(out, 'frames.json'), JSON.stringify(frames)); writeFileSync(join(out, 'marks.json'), JSON.stringify(marks));
writeFileSync(join(out, 'rect.json'), JSON.stringify({ union: u, boxes, dpr: +(process.env.DPR || 1), end: tEnd }));
console.log('frames', frames.length, 'span', (frames.at(-1) - frames[0]).toFixed(2), 'union', u.map(Math.round).join(','));
ws.close(); chrome.kill(); process.exit(0);
