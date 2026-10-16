import { configured, passwordOk, makeCookie, clearCookie, isAuthed, sameOrigin } from './_auth.js';
const tries = new Map(); // best-effort limiter (per server instance)
export default async function handler(req, res) {
  if (!configured()) return res.status(500).json({ error: 'Server not configured' });
  if (req.method === 'GET') return res.json({ ok: isAuthed(req) });
  if (req.method !== 'POST' || !sameOrigin(req)) return res.status(403).json({ error: 'Forbidden' });
  if (req.body?.logout) { res.setHeader('Set-Cookie', clearCookie()); return res.json({ ok: false }); }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'x';
  const t = tries.get(ip) || { n: 0, until: 0 };
  if (Date.now() < t.until) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  const pw = typeof req.body?.password === 'string' ? req.body.password.slice(0, 200) : '';
  if (pw && passwordOk(pw)) { tries.delete(ip); res.setHeader('Set-Cookie', makeCookie()); return res.json({ ok: true }); }
  t.n++; if (t.n >= 5) { t.until = Date.now() + 15 * 60e3; t.n = 0; }
  tries.set(ip, t);
  await new Promise(r => setTimeout(r, 600));
  return res.status(401).json({ error: 'Wrong password' });
}
