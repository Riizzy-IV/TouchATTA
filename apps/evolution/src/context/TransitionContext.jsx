import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const navigate   = useNavigate();
  const overlayRef = useRef(null);
  const [visible, setVisible]  = useState(false);

  const runTransition = useCallback((route, fadeInDur, delayOut, fadeOutDur) => {
    setVisible(true);
    requestAnimationFrame(() => {
      const el = overlayRef.current;
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: fadeInDur,
          ease: 'power2.inOut',
          onComplete: () => {
            navigate(route);
            gsap.to(el, {
              opacity: 0,
              duration: fadeOutDur,
              delay: delayOut,
              ease: 'power2.inOut',
              onComplete: () => setVisible(false),
            });
          },
        }
      );
    });
  }, [navigate]);

  const startTransition = useCallback((route) => runTransition(route, 0.4, 0.25, 0.45), [runTransition]);
  const closeModule     = useCallback(()      => runTransition('/', 0.35, 0.2, 0.4),   [runTransition]);

  return (
    <TransitionContext.Provider value={{ startTransition, closeModule }}>
      {children}
      {visible && (
        <div ref={overlayRef} style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: '#0B1628',
          opacity: 0,
        }} />
      )}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
