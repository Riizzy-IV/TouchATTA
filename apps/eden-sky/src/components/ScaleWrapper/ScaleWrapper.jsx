import { useState, useEffect } from 'react';

const DESIGN_W = 1440;
const DESIGN_H = 810;
const MOBILE_BP = 768;

function isMobile() {
  return window.innerWidth <= MOBILE_BP;
}

export default function ScaleWrapper({ children }) {
  const [mobile, setMobile] = useState(() => isMobile());
  const [scale, setScale] = useState(() =>
    Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  );

  useEffect(() => {
    function update() {
      setMobile(isMobile());
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
        background: '#dcd6c9',
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
      height: '100vh',
      background: '#15130f',
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
        outline: '1px solid rgba(44, 41, 37, 0.1)',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)',
      }}>
        {children}
      </div>
    </div>
  );
}
