import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import styles from './Construtora.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TABS = [
  { id: 'construtora', label: 'construtora' },
  { id: 'quem-somos', label: 'quem somos' },
];

export default function Construtora() {
  const { startTransition } = useTransition();
  const [tab, setTab] = useState('construtora');

  const sceneRef   = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef   = useRef(null);
  const closeRef   = useRef(null);
  const tabsRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(tabsRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      )
      .fromTo(eyebrowRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.2'
      )
      .fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(closeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.6'
      );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.scene} ref={sceneRef}>

      {/* Botão fechar */}
      <button className={styles.closeBtn} ref={closeRef} onClick={() => startTransition('/', '')}>
        <IconClose />
      </button>

      {/* Menu de abas */}
      <nav className={styles.tabs} ref={tabsRef}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Aba: construtora */}
      {tab === 'construtora' && (
        <div className={styles.center}>
          <span className={styles.eyebrow} ref={eyebrowRef}>A CONSTRUTORA</span>
          <div className={styles.titleRow} ref={titleRef}>
            <h1 className={styles.title}>CARRILHO URBAN</h1>
          </div>
          <p className={styles.tagline}>Um Carrilho desenhado para abraçar o seu ritmo.</p>
        </div>
      )}

      {/* Aba: quem somos */}
      {tab === 'quem-somos' && (
        <div className={styles.emBreve}>
          <span className={styles.emBreveLabel}>EM BREVE</span>
          <p className={styles.emBreveSubtitle}>QUEM SOMOS</p>
        </div>
      )}

      {/* Logo Carrilho no canto */}
      <img src="/img/carrilho-logo.png" alt="Carrilho Urban" className={styles.logo} />

    </div>
  );
}
