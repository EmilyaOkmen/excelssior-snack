import { useState } from 'react';
import { categories } from "../../shared/menu/index.js";
import Splash from './components/Splash.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import ItemCard from './components/ItemCard.jsx';
import ItemSheet from './components/ItemSheet.jsx';
import CartBar from './components/CartBar.jsx';
import Checkout from './components/Checkout.jsx';

export default function App() {
  const [ready, setReady] = useState(false);
  const [cat, setCat] = useState(categories[0].id);
  const [picked, setPicked] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const current = categories.find((c) => c.id === cat);
  const paid = new URLSearchParams(location.search).has('betaald');

  return (
    <>
      {!ready && <Splash onDone={() => setReady(true)} />}
      {paid && <p style={{ background: 'var(--o-soft)', padding: 16, textAlign: 'center' }}>Bedankt! Je bestelling is ontvangen 🧡</p>}
      <header><h2>Excelsior<span>.</span>snack</h2></header>
      <CategoryTabs categories={categories} active={cat} onSelect={setCat} />
      <main className="list">
        {current.items.map((i) => (
          <ItemCard key={i.id} item={i} onOpen={() => setPicked(i)} />
        ))}
      </main>
      {picked && <ItemSheet item={picked} options={current.options} onClose={() => setPicked(null)} />}
      <CartBar onOpen={() => setCheckout(true)} />
      {checkout && <Checkout onClose={() => setCheckout(false)} />}
    </>
  );
}