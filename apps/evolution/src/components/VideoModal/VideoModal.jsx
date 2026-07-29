import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './VideoModal.module.css';

export default function VideoModal({ onClose }) {
  const overlayRef = useRef(null);
  const boxRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
      gsap.from(boxRef.current, { opacity: 0, scale: 0.92, duration: 0.4, delay: 0.1, ease: 'back.out(1.4)' });
    });
    return () => ctx.revert();
  }, []);

  function handleClose() {
    gsap.to(boxRef.current,    { opacity: 0, scale: 0.94, duration: 0.25, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, delay: 0.15, onComplete: onClose });
  }

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={handleClose}>
      <div ref={boxRef} className={styles.box} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        <iframe
          className={styles.iframe}
          src="https://www.youtube.com/embed/feZbQ4nK-z4?start=2&autoplay=1&rel=0"
          title="Evolution Tatuapé"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
