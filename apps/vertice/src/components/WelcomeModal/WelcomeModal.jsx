import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useFullscreen } from '@showcase/core';
import styles from './WelcomeModal.module.css';

export default function WelcomeModal({ onStart }) {
  const overlayRef = useRef(null);
  const boxRef = useRef(null);
  const { enter } = useFullscreen();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' });
      gsap.from(boxRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.92,
        duration: 0.7,
        delay: 0.2,
        ease: 'back.out(1.4)',
      });
    });
    return () => ctx.revert();
  }, []);

  function handleStart() {
    enter();
    const ctx = gsap.context(() => {
      gsap.to(boxRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        delay: 0.25,
        onComplete: onStart,
      });
    });
  }

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div ref={boxRef} className={styles.box}>
        <div className={styles.logos}>
          <img src="/img/logo.png" alt="Vértice Anália Franco" className={styles.logoImg} />
        </div>

        <p className={styles.subtitle}>
          Para uma melhor experiência de navegação,<br />
          este touchapp será executado em tela cheia.
        </p>

        <button className={styles.btn} onClick={handleStart}>
          INICIAR NAVEGAÇÃO
        </button>
      </div>
    </div>
  );
}
