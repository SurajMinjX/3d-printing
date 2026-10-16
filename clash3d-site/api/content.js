import { put, list } from '@vercel/blob';
import { isAuthed, sameOrigin } from './_auth.js';
const s = (v, n) => String(v ?? '').trim().slice(0, n);
const IMG = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[\w\-\/.]+$/i;
function clean(b) {
  const wa = String(b?.whatsapp ?? '').replace(/\D/g, '');
  return {
    whatsapp: /^\d{8,15}$/.test(wa) ? wa : '91XXXXXXXXXX',
    promo: { title: s(b?.promo?.title, 60), text: s(b?.promo?.text, 240), button: s(b?.promo?.button, 30) },
    products: (Array.isArray(b?.products) ? b.products : []).slice(0, 60).map(p => ({
      name: s(p?.name, 60), price: s(p?.price, 30), desc: s(p?.desc, 200), emoji: s(p?.emoji, 8),
      cat: p?.cat === 'business' ? 'business' : 'gift', image: IMG.test(p?.image || '') ? p.image : ''
    })).filter(p => p.name),
    reviews: (Array.isArray(b?.reviews) ? b.reviews : []).slice(0, 30).map(r => ({ name: s(r?.name, 40), text: s(r?.text, 300) })).filter(r => r.text)
  };
}
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: 'content.json' });
      if (!blobs.length) return res.json(null);
      const r = await fetch(blobs[0].url + '?t=' + Date.now());
      return res.json(clean(await r.json()));
    }
    if (req.method === 'PUT') {
      if (!sameOrigin(req) || !isAuthed(req)) return res.status(401).json({ error: 'Please log in again' });
      const data = clean(req.body);
      await put('content.json', JSON.stringify(data), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
      return res.json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) { return res.status(500).json({ error: 'Storage error. Check the Blob store is connected.' }); }
}
