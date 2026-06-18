import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const TransitionContext = createContext(null);

/**
 * @param {{ logoSrc: string, overlayColor: string, children: React.ReactNode }} props
 */
export function TransitionProvider({ children, logoSrc, overlayColor = '#e8f0f3' }) {
  const navigate   = useNavigate();
  const overlayRef = useRef(null);
  const logoRef    = useRef(null);
  const [visible, setVisible] = useState(false);

  const animateLogo = useCallback(() => {
    const logo = logoRef.current;
    if (!logo) return;
    gsap.fromTo(logo,
      { opacity: 0, scale: 0.88, y: 18 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' }
    );
  }, []);

  const runTransition = useCallback((route, fadeInDuration, fadeOutDelay, fadeOutDuration) => {
    setVisible(true);
    requestAnimationFrame(() => {
      const el = overlayRef.current;
      if (!el) return;

      const goToRoute = () => {
        navigate(route);
        gsap.to(el, {
          opacity: 0,
          duration: fadeOutDuration,
          delay: fadeOutDelay,
          ease: 'power2.inOut',
          onComplete: () => setVisible(false),
        });
      };

      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: fadeInDuration,
          ease: 'power2.inOut',
          onStart: animateLogo,
          onComplete: () => {
            const logo = logoRef.current;
            if (logo && logo.tagName === 'VIDEO') {
              if (logo.ended) goToRoute();
              else logo.addEventListener('ended', goToRoute, { once: true });
            } else {
              goToRoute();
            }
          },
        }
      );
    });
  }, [navigate, animateLogo]);

  const startTransition = useCallback((route) => {
    runTransition(route, 0.45, 0.3, 0.5);
  }, [runTransition]);

  const closeModule = useCallback(() => {
    runTransition('/', 0.35, 0.2, 0.45);
  }, [runTransition]);

  return (
    <TransitionContext.Provider value={{ startTransition, closeModule }}>
      {children}
      {visible && (
        <div ref={overlayRef} style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: overlayColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
        }}>
          {logoSrc && (
            /\.(webm|mp4)$/i.test(logoSrc) ? (
              <video
                ref={logoRef}
                src={logoSrc}
                autoPlay
                muted
                playsInline
                style={{
                  width: 'clamp(260px, 28vw, 460px)',
                  opacity: 0,
                  mixBlendMode: 'multiply',
                  userSelect: 'none',
                }}
              />
            ) : (
              <img
                ref={logoRef}
                src={logoSrc}
                draggable={false}
                style={{
                  width: 'clamp(260px, 28vw, 460px)',
                  opacity: 0,
                  mixBlendMode: 'multiply',
                  userSelect: 'none',
                }}
              />
            )
          )}
        </div>
      )}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
