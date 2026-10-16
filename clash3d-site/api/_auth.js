import crypto from 'node:crypto';
const h = s => crypto.createHash('sha256').update(String(s)).digest();
const mac = p => crypto.createHmac('sha256', process.env.SESSION_SECRET).update(p).digest('hex');
export const configured = () => !!process.env.ADMIN_PASSWORD && (process.env.SESSION_SECRET || '').length >= 24;
export const passwordOk = pw => crypto.timingSafeEqual(h(pw), h(process.env.ADMIN_PASSWORD));
export const makeCookie = () => {
  const exp = String(Date.now() + 8 * 3600e3);
  return `cs=${exp}.${mac(exp)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800`;
};
export const clearCookie = () => 'cs=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0';
export function isAuthed(req) {
  if (!configured()) return false;
  const m = /(?:^|;\s*)cs=(\d+)\.([a-f0-9]{64})/.exec(req.headers.cookie || '');
  if (!m || Number(m[1]) < Date.now()) return false;
  const a = Buffer.from(mac(m[1])), b = Buffer.from(m[2]);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
export function sameOrigin(req) {
  try { return new URL(req.headers.origin).host === req.headers.host; } catch { return false; }
}
