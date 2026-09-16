import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const PreloadContext = createContext(null);
const PRELOAD_MS = 2000;

export function PreloadProvider({ children }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  const videoRef = useRef(null);

  const runPreload = useCallback((route) => {
    setVisible(true);

    requestAnimationFrame(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    });

    setTimeout(() => {
      navigate(route);
      requestAnimationFrame(() => {
        gsap.to(overlayRef.current, {
          opacity: 0, duration: 0.6, ease: 'power2.inOut',
          onComplete: () => setVisible(false),
        });
      });
    }, PRELOAD_MS);
  }, [navigate]);

  return (
    <PreloadContext.Provider value={{ runPreload }}>
      {children}
      {visible && (
        <div
          ref={overlayRef}
          style={{
            position: 'fixed', inset: 0, zIndex: 9500,
            background: '#0A192C', opacity: 0, overflow: 'hidden',
          }}
        >
          <video
            ref={videoRef}
            src="/video/preloader.mp4"
            autoPlay
            muted
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <img
            src="/img/bravia-simbolo-branco.svg"
            alt=""
            style={{
              position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)',
              width: 30, height: 30, opacity: 0.85,
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
            }}
          />
        </div>
      )}
    </PreloadContext.Provider>
  );
}

export function usePreload() {
  return useContext(PreloadContext);
}
