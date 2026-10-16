import { put } from '@vercel/blob';
import crypto from 'node:crypto';
import { isAuthed, sameOrigin } from './_auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST' || !sameOrigin(req) || !isAuthed(req)) return res.status(401).json({ error: 'Please log in again' });
  try {
    const m = /^data:image\/jpeg;base64,([A-Za-z0-9+\/=]+)$/.exec(req.body?.image || '');
    if (!m) return res.status(400).json({ error: 'Invalid image' });
    const buf = Buffer.from(m[1], 'base64');
    if (buf.length > 1_500_000 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return res.status(400).json({ error: 'Image must be a JPEG under 1.5 MB' });
    const b = await put(`products/${crypto.randomUUID()}.jpg`, buf, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false });
    return res.json({ url: b.url });
  } catch (e) { return res.status(500).json({ error: 'Upload failed' }); }
}
