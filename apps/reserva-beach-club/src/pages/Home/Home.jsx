import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import styles from './Home.module.css';

const IconVideo = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.7v6.6l5.5-3.3L10 8.7Z" />
  </svg>
);

const IconLocalizacao = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M12 20.5s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0c0 5 6.5 11 6.5 11Z" />
    <circle cx="12" cy="9.3" r="2.2" />
  </svg>
);

const IconProjeto = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="0.6" />
    <path d="M4 14h7v6" />
    <path d="M14 4v7h6" />
    <path d="M11 14a3 3 0 0 0 3-3" />
  </svg>
);

const IconGaleria = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
    <circle cx="8" cy="10" r="1.3" />
    <path d="M4.2 16.5 8.5 12l3.5 3.5 2.5-2.5 4.8 4.5" />
  </svg>
);

const IconSocio = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9.5" cy="8.5" r="3" />
    <path d="M3.8 19.5c0-3.2 2.5-5.5 5.7-5.5s5.7 2.3 5.7 5.5" />
    <path d="M15.5 5.7a3 3 0 0 1 0 5.6" />
    <path d="M17.6 14.4c1.7.7 2.8 2.4 2.8 5.1" />
  </svg>
);

const NAV_ITEMS = [
  { id: '01', label: 'Vídeo',       icon: IconVideo,       ready: false },
  { id: '02', label: 'Localização', icon: IconLocalizacao, ready: true, route: '/modulo/02' },
  { id: '03', label: 'Projeto',     icon: IconProjeto,     ready: true, route: '/modulo/03' },
  { id: '04', label: 'Galeria',     icon: IconGaleria,     ready: true, route: '/modulo/04' },
  { id: '05', label: 'Sócio',       icon: IconSocio,       ready: true, route: '/modulo/05' },
];

export default function Home() {
  const { startTransition } = useTransition();
  const sceneRef    = useRef(null);
  const leftRef     = useRef(null);
  const rightRef    = useRef(null);
  const symbolRef   = useRef(null);
  const wordmarkRef = useRef(null);
  const navRef      = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });
      const tl = gsap.timeline();
      tl.to(sceneRef.current, { opacity: 1, duration: 0.7, ease: 'power2.inOut' });
      tl.from(rightRef.current, { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.4');
      tl.from(leftRef.current, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.8');
      tl.from(symbolRef.current, { y: -16, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
      tl.from(wordmarkRef.current, { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');
      tl.from(navRef.current.children, { x: 24, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.5');
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene}>

      <div ref={rightRef} className={styles.rightPhoto}>
        <img src="/img/home-right.webp" alt="" className={styles.rightPhotoImg} draggable={false} />
        <div className={styles.rightPhotoTint} />
      </div>

      <div ref={leftRef} className={styles.leftPhoto}>
        <img src="/img/home-bg.webp" alt="Reserva Beach Club" className={styles.leftPhotoImg} draggable={false} />
        <div className={styles.leftPhotoShade} />
        <span className={styles.leftPhotoEdge} />
      </div>

      <div ref={symbolRef} className={styles.symbolWrap}>
        <img src="/img/logo.svg" alt="" className={styles.symbol} draggable={false} />
      </div>

      <div ref={wordmarkRef} className={styles.wordmark}>
        <p className={styles.wordmarkMain}>RESERVA</p>
        <p className={styles.wordmarkSub}>beach club</p>
      </div>

      <nav ref={navRef} className={styles.nav}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${styles.navBtn} ${item.ready ? styles.navBtnActive : ''}`}
              disabled={!item.ready}
              onClick={() => item.route && startTransition(item.route, item.label)}
            >
              <span className={styles.navLabel}>{item.label}</span>
              <span className={styles.navIcon}><Icon /></span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
