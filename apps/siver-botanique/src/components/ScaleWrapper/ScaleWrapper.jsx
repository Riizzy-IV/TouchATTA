import { useState, useEffect } from 'react';

const DESIGN_W = 1440;
const DESIGN_H = 810;

export default function ScaleWrapper({ children }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      setScale(Math.min(sw / DESIGN_W, sh / DESIGN_H));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#f5f0e8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        width: DESIGN_W,
        height: DESIGN_H,
        flexShrink: 0,
        transformOrigin: 'center center',
        transform: `scale(${scale})`,
      }}>
        {children}
      </div>
    </div>
  );
}
