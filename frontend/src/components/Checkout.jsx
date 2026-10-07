import { useState } from 'react';
import { useCart, eur } from '../context/CartContext.jsx';

export default function Checkout({ onClose }) {
  const { lines, dispatch, total } = useCart();
  const [f, setF] = useState({ name: '', phone: '', time: '', note: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name && f.phone && f.time && lines.length;

  const pay = async () => {
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: f, lines: lines.map(({ id, opt, qty }) => ({ id, opt, qty })) }),
      });
      const { checkoutUrl, error } = await r.json();
      if (!checkoutUrl) throw new Error(error || 'Mislukt');
      dispatch({ type: 'clear' });
      window.location.href = checkoutUrl;
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" style={{ maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <h2>Jouw bestelling</h2>
        {lines.map((l) => {
          const key = l.id + '|' + l.opt;
          return (
            <div className="line" key={key}>
              <div><b>{l.name}</b><div style={{ color: 'var(--mute)', fontSize: '.8rem' }}>{l.opt} · {eur(l.price)}</div></div>
              <div className="qty">
                <button onClick={() => dispatch({ type: 'change', key, d: -1 })}>−</button>
                <span>{l.qty}</span>
                <button onClick={() => dispatch({ type: 'change', key, d: 1 })}>+</button>
              </div>
            </div>
          );
        })}
        <input className="field" placeholder="Naam" value={f.name} onChange={set('name')} />
        <input className="field" placeholder="GSM-nummer" type="tel" value={f.phone} onChange={set('phone')} />
        <input className="field" type="time" value={f.time} onChange={set('time')} />
        <input className="field" placeholder="Opmerking (optioneel)" value={f.note} onChange={set('note')} />
        {err && <p style={{ color: 'crimson', marginTop: 8 }}>{err}</p>}
        <button className="btn" disabled={!valid || busy} onClick={pay}>
          {busy ? 'Even geduld…' : `Betalen · ${eur(total)}`}
        </button>
      </div>
    </div>
  );
}