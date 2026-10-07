import { useCart, eur } from '../context/CartContext.jsx';

export default function CartBar({ onOpen }) {
  const { count, total } = useCart();
  if (!count) return null;
  return (
    <button className="cartbar" onClick={onOpen}>
      <span>Winkelmandje ({count})</span>
      <span>{eur(total)}</span>
    </button>
  );
}