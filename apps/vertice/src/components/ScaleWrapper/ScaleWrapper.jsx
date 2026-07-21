import { useState, useEffect } from 'react';

const DESIGN_W = 1440;
const DESIGN_H = 810;
const MOBILE_BP = 768;

function isMobileDevice() {
  return window.innerWidth <= MOBILE_BP;
}

export default function ScaleWrapper({ children }) {
  const [mobile, setMobile] = useState(() => isMobileDevice());
  const [scale, setScale] = useState(() =>
    Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  );

  useEffect(() => {
    function update() {
      setMobile(isMobileDevice());
      setScale(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H));
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (mobile) {
    return (
      <div style={{
        width: '100vw',
        height: '100svh',
        background: '#071820',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100svh',
      background: '#071820',
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
