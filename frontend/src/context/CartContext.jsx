import { createContext, useContext, useReducer } from 'react';

const Ctx = createContext();
export const useCart = () => useContext(Ctx);

function reducer(lines, a) {
  const key = (l) => l.id + '|' + l.opt;
  switch (a.type) {
    case 'add': {
      const i = lines.findIndex((l) => key(l) === key(a.line));
      if (i < 0) return [...lines, { ...a.line, qty: 1 }];
      return lines.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
    }
    case 'change':
      return lines
        .map((l) => (key(l) === a.key ? { ...l, qty: l.qty + a.d } : l))
        .filter((l) => l.qty > 0);
    case 'clear':
      return [];
    default:
      return lines;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  return <Ctx.Provider value={{ lines, dispatch, count, total }}>{children}</Ctx.Provider>;
}

export const eur = (n) => n.toFixed(2).replace('.', ',') + ' €';