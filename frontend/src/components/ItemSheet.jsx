import { useState } from 'react';
import { useCart, eur } from '../context/CartContext.jsx';

export default function ItemSheet({ item, options, onClose }) {
  const { dispatch } = useCart();
  const [sel, setSel] = useState(0);
  const add = () => {
    dispatch({ type: 'add', line: { id: item.id, name: item.name, opt: options[sel], price: item.prices[sel] } });
    onClose();
  };
  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h2>{item.name}</h2>
        {item.desc && <p style={{ color: 'var(--mute)', marginTop: 4 }}>{item.desc}</p>}
        {options.map((o, i) => (
          <button key={o} className={'opt' + (sel === i ? ' on' : '')} onClick={() => setSel(i)}>
            <span>{o}</span>
            <span className="price">{eur(item.prices[i])}</span>
          </button>
        ))}
        <button className="btn" onClick={add}>Toevoegen · {eur(item.prices[sel])}</button>
      </div>
    </div>
  );
}