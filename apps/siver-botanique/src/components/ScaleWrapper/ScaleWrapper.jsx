import { useState, useEffect } from 'react';

const DESIGN_W = 1440;
const DESIGN_H = 810;

export default function ScaleWrapper({ children }) {
  const [scale, setScale] = useState(null);

  useEffect(() => {
    function update() {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const isPortrait = sh > sw;
      const isMobile   = sw <= 768;

      if (!isPortrait && !isMobile) { setScale(null); return; }
      setScale(Math.min(sw / DESIGN_W, sh / DESIGN_H));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (scale === null) return <>{children}</>;

  return (
    <div style={{
      width: '100vw',
      height: '100svh',
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
