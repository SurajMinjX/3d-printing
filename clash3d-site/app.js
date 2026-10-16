const $ = s => document.querySelector(s);
const el = (t, a = {}, ...k) => { const e = Object.assign(document.createElement(t), a); e.append(...k); return e; };
const DEFAULT = {
  whatsapp: '91XXXXXXXXXX',
  promo: { title: 'Opening offer', text: 'Order your first custom keychain this month and get a free colour change.', button: 'Claim offer' },
  products: [
    { name: 'Custom Keychain', price: 'From ₹99', desc: 'Your name, logo or any small design.', emoji: '🔑', cat: 'gift', image: '' },
    { name: 'Nameplate', price: 'From ₹299', desc: 'Desk or door nameplates in your style.', emoji: '🪪', cat: 'gift', image: '' },
    { name: 'Flexi Toy', price: 'From ₹199', desc: 'Bendy, colourful and fun to hold.', emoji: '🐉', cat: 'gift', image: '' },
    { name: 'Desk Organiser', price: 'From ₹349', desc: 'Pen stands, phone holders and more.', emoji: '🗂️', cat: 'gift', image: '' },
    { name: 'QR Stand', price: 'From ₹249', desc: 'Neat stands for payment or menu QR codes.', emoji: '📱', cat: 'business', image: '' },
    { name: 'Logo Display', price: 'From ₹499', desc: 'Show your brand logo in 3D.', emoji: '✨', cat: 'business', image: '' },
    { name: 'Counter Sign', price: 'From ₹399', desc: 'Name boards and signs for your counter.', emoji: '🏪', cat: 'business', image: '' }
  ],
  reviews: []
};
let C = DEFAULT;
const wa = t => 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(t);
const link = (cls, text, href) => el('a', { className: cls, textContent: text, href, target: '_blank', rel: 'noopener' });

function card(p) {
  const img = el('div', { className: 'img' });
  if (p.image) img.append(el('img', { src: p.image, alt: p.name, loading: 'lazy' })); else img.textContent = p.emoji || '🧊';
  return el('div', { className: 'card' }, img, el('div', { className: 'bd' },
    el('h3', { textContent: p.name }), el('p', { textContent: p.desc }), el('div', { className: 'price', textContent: p.price }),
    link('btn ghost sm', 'Ask about this', wa("Hi CLASH 3D! I'm interested in: " + p.name))));
}
function render() {
  $('#giftGrid').replaceChildren(...C.products.filter(p => p.cat !== 'business').map(card));
  $('#bizGrid').replaceChildren(...C.products.filter(p => p.cat === 'business').map(card));
  $('#biz').hidden = !C.products.some(p => p.cat === 'business');
  $('#revWrap').hidden = !C.reviews.length;
  $('#revGrid').replaceChildren(...C.reviews.map(r => el('div', { className: 'quote' }, el('p', { textContent: '“' + r.text + '”' }), el('b', { textContent: r.name || 'Customer' }))));
  $('#promoWrap').hidden = !C.promo.title;
  $('#promo').replaceChildren(el('div', {}, el('h2', { textContent: C.promo.title }), el('p', { textContent: C.promo.text })),
    link('btn', C.promo.button || 'Message us', wa('Hi CLASH 3D! About your offer: ' + C.promo.title)));
  const g = wa("Hi CLASH 3D! I'd like to know more about custom 3D printing.");
  $('#waBtn').href = g; $('#wafab').href = g;
}
render();
fetch('/api/content').then(r => r.ok ? r.json() : null).then(d => { if (d && Array.isArray(d.products)) { C = d; render(); } }).catch(() => {});
$('#oform').onsubmit = e => { e.preventDefault(); window.open(wa("Hi CLASH 3D! I'm " + $('#n').value + '. I need: ' + $('#t').value + '.\n' + $('#d').value), '_blank', 'noopener'); };

/* ---- intro ---- */
(() => {
  let seen = false; try { seen = sessionStorage.getItem('intro'); } catch {}
  if (seen || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const i = el('div', { id: 'intro' });
  i.innerHTML = '<button id="skip" class="btn sm" type="button">Skip intro</button><div class="ly on" id="l1"><svg id="globe" viewBox="0 0 400 400" aria-hidden="true"><defs><radialGradient id="g" cx="40%" cy="35%"><stop offset="0" stop-color="#17345e"/><stop offset="1" stop-color="#050b16"/></radialGradient></defs><circle cx="200" cy="200" r="170" fill="url(#g)" stroke="#22d3ee" stroke-opacity=".5"/><g fill="none" stroke="#22d3ee" stroke-opacity=".18"><ellipse cx="200" cy="200" rx="170" ry="60"/><ellipse cx="200" cy="200" rx="80" ry="170"/><line x1="30" y1="200" x2="370" y2="200"/><line x1="200" y1="30" x2="200" y2="370"/></g><g transform="translate(130 70) scale(.9)"><polygon fill="rgba(34,211,238,.28)" stroke="#22d3ee" points="60,20 90,10 120,25 150,30 170,50 160,70 185,85 150,95 140,120 120,150 105,190 95,205 85,185 70,150 55,125 30,110 40,90 55,70 50,45"/><circle cx="118" cy="100" r="4" fill="#ff8a3d"/></g></svg></div><div class="ly" id="l3"><div id="map"></div><div class="pin"><i></i><b>BILASPUR, CHHATTISGARH</b><small>21.25°N · 82.15°E</small></div></div><div class="ly" id="l4"><div><h2>CLASH <span>3D</span></h2><p>Socho Tum, Banaayein Hum</p></div></div><div id="cap">Stylised map animation, not real drone footage.</div>';
  document.body.append(i); document.body.classList.add('locked');
  const T = [], at = (f, ms) => T.push(setTimeout(f, ms));
  const end = () => { T.forEach(clearTimeout); i.classList.add('done'); document.body.classList.remove('locked'); try { sessionStorage.setItem('intro', 1); } catch {} setTimeout(() => i.remove(), 1000); };
  at(() => $('#globe').classList.add('zoom'), 500);
  at(() => { $('#l1').classList.remove('on'); $('#l3').classList.add('on'); }, 3000);
  at(() => { $('#l3').classList.remove('on'); $('#l4').classList.add('on'); }, 6000);
  at(end, 8000); $('#skip').onclick = end;
})();

/* ---- owner panel (all changes are checked again on the server) ---- */
async function api(path, body, method = 'POST') {
  const r = await fetch(path, { method, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Something went wrong');
  return d;
}
$('#owner').onclick = async () => {
  let ok = false; try { ok = (await fetch('/api/login', { credentials: 'same-origin' }).then(r => r.json())).ok; } catch {}
  ok ? editor() : login();
};
function modal(...k) { $('#adm')?.remove(); const m = el('div', { id: 'adm' }, el('div', { className: 'panel' }, ...k)); document.body.append(m); return m; }
function login() {
  const msg = el('div', { className: 'msg' }), pw = el('input', { type: 'password', autocomplete: 'current-password', maxLength: 200 });
  const go = el('button', { className: 'btn', textContent: 'Log in', type: 'button' }), x = el('button', { className: 'btn ghost', textContent: 'Close', type: 'button' });
  const m = modal(el('h2', { textContent: 'Owner login' }), el('label', { textContent: 'Password' }), pw, go, ' ', x, msg);
  x.onclick = () => m.remove(); pw.focus();
  const run = async () => { try { await api('/api/login', { password: pw.value }); editor(); } catch (e) { msg.textContent = e.message; } };
  go.onclick = run; pw.onkeydown = e => { if (e.key === 'Enter') run(); };
}
function editor() {
  const W = structuredClone(C), msg = el('div', { className: 'msg' }), say = t => msg.textContent = t;
  const f = (label, tag = 'input', a = {}) => { const i = el(tag, a); return [el('label', { textContent: label }), i, i]; };
  const lp = el('div'), lr = el('div');
  const list = () => {
    lp.replaceChildren(...W.products.map((p, n) => el('div', { className: 'row' }, el('span', { textContent: p.name + (p.cat === 'business' ? ' (shop)' : '') + (p.image ? ' 📷' : '') }),
      el('button', { className: 'btn red sm', type: 'button', textContent: 'Remove', onclick: () => { W.products.splice(n, 1); list(); } }))));
    lr.replaceChildren(...W.reviews.map((r, n) => el('div', { className: 'row' }, el('span', { textContent: (r.name || 'Customer') + ': ' + r.text.slice(0, 40) }),
      el('button', { className: 'btn red sm', type: 'button', textContent: 'Remove', onclick: () => { W.reviews.splice(n, 1); list(); } }))));
  };
  const [l1, an] = f('Name', 'input', { maxLength: 60 }), [l2, ap] = f('Price', 'input', { maxLength: 30, placeholder: 'From ₹149' }), [l3, ad] = f('Description', 'textarea', { maxLength: 200 });
  const [l4, ai] = f('Photo (optional)', 'input', { type: 'file', accept: 'image/*' });
  const cat = el('select', {}, el('option', { value: 'gift', textContent: 'Gift / personal' }), el('option', { value: 'business', textContent: 'For shops' }));
  const add = el('button', { className: 'btn sm', type: 'button', textContent: 'Add creation' });
  add.onclick = async () => {
    const name = an.value.trim(); if (!name) return say('Please enter a name.');
    const p = { name, price: ap.value, desc: ad.value, emoji: '', cat: cat.value, image: '' };
    try {
      if (ai.files[0]) {
        say('Uploading photo…');
        const b = await createImageBitmap(ai.files[0]), sc = Math.min(1, 800 / b.width), c = el('canvas', { width: Math.round(b.width * sc), height: Math.round(b.height * sc) });
        c.getContext('2d').drawImage(b, 0, 0, c.width, c.height);
        p.image = (await api('/api/upload', { image: c.toDataURL('image/jpeg', .85) })).url;
      }
      W.products.push(p); [an, ap, ad, ai].forEach(i => i.value = ''); list(); say('Added. Press Save to publish.');
    } catch (e) { say(e.message); }
  };
  const [r1, rn] = f('Customer name', 'input', { maxLength: 40 }), [r2, rt] = f('Their message', 'textarea', { maxLength: 300 });
  const radd = el('button', { className: 'btn sm', type: 'button', textContent: 'Add review', onclick: () => { if (!rt.value.trim()) return say('Please enter the message.'); W.reviews.push({ name: rn.value, text: rt.value }); rn.value = rt.value = ''; list(); say('Added. Press Save to publish.'); } });
  const [p1, pt] = f('Title (leave empty to hide)', 'input', { maxLength: 60, value: W.promo.title }), [p2, px] = f('Text', 'textarea', { maxLength: 240, value: W.promo.text }), [p3, pb] = f('Button text', 'input', { maxLength: 30, value: W.promo.button });
  const [w1, wn] = f('WhatsApp number with country code', 'input', { inputMode: 'numeric', maxLength: 15, value: W.whatsapp, placeholder: '919876543210' });
  const save = el('button', { className: 'btn', type: 'button', textContent: 'Save and publish' }), cx = el('button', { className: 'btn ghost', type: 'button', textContent: 'Close' });
  const out = el('button', { className: 'btn ghost', type: 'button', textContent: 'Log out' });
  const m = modal(el('h2', { textContent: 'Edit your site' }), el('div', { className: 'h3', textContent: 'Creations' }), lp,
    el('div', { className: 'h3', textContent: 'Add a creation' }), l1, an, l2, ap, l3, ad, el('label', { textContent: 'Section' }), cat, l4, ai, add,
    el('div', { className: 'h3', textContent: 'Customer reviews' }), lr, r1, rn, r2, rt, radd,
    el('div', { className: 'h3', textContent: 'Promotion banner' }), p1, pt, p2, px, p3, pb, el('div', { className: 'h3', textContent: 'WhatsApp' }), w1, wn, msg,
    el('div', { className: 'cta' }, save, cx, out));
  list();
  save.onclick = async () => {
    W.promo = { title: pt.value, text: px.value, button: pb.value }; W.whatsapp = wn.value;
    say('Publishing…'); try { C = await api('/api/content', W, 'PUT'); render(); say('Published. Your site is updated.'); } catch (e) { say(e.message); }
  };
  cx.onclick = () => m.remove();
  out.onclick = async () => { await api('/api/login', { logout: true }).catch(() => {}); m.remove(); };
}
