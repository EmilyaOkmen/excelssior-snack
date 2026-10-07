import { useEffect, useState } from 'react';

export default function Splash({ onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setOut(true), 1800);
    const b = setTimeout(onDone, 2300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [onDone]);
  return (
    <div className={'splash' + (out ? ' out' : '')}>
      <div>
        <h1>EXCELSIOR</h1>
        <p>SNACK</p>
      </div>
    </div>
  );
}