import { eur } from '../context/CartContext.jsx';

export default function ItemCard({ item, onOpen }) {
  return (
    <button className="card" onClick={onOpen}>
      <div>
        <h3>{item.name}</h3>
        {item.desc && <p>{item.desc}</p>}
      </div>
      <span className="price">vanaf {eur(Math.min(...item.prices))}</span>
    </button>
  );
}