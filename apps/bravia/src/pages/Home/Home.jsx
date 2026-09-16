import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { usePreload } from '../../context/PreloadContext';
import styles from './Home.module.css';

const IconVideo = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10.3 8.7v6.6l5.6-3.3-5.6-3.3z" fill="currentColor" stroke="none" />
  </svg>
);

const IconLocalizacao = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M12 21.2s6.5-6.4 6.5-11.4a6.5 6.5 0 10-13 0c0 5 6.5 11.4 6.5 11.4z" />
    <circle cx="12" cy="9.8" r="2.2" />
  </svg>
);

const IconProjeto = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M4 11.5L12 5l8 6.5" />
    <path d="M6 10.3V19a1 1 0 001 1h10a1 1 0 001-1v-8.7" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

const IconGaleria = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <rect x="3.5" y="4.5" width="14" height="14" rx="1.5" />
    <circle cx="8" cy="9" r="1.3" />
    <path d="M3.5 15l4-4a1.2 1.2 0 011.7 0l3.8 3.8" />
    <path d="M13 12.5l1.3-1.3a1.2 1.2 0 011.7 0l1.5 1.5" />
    <path d="M20.5 7.5v11a1.5 1.5 0 01-1.5 1.5h-11" opacity=".5" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MODULES = [
  { id: '01', label: 'Vídeo', icon: <IconVideo />, action: 'video' },
  { id: '02', label: 'Localização', icon: <IconLocalizacao />, route: '/localizacao' },
  { id: '03', label: 'Projeto', icon: <IconProjeto />, route: '/projeto' },
  { id: '04', label: 'Galeria', icon: <IconGaleria />, route: null },
];

const PHASE = { ESPERA: 'espera', FIXO: 'fixo', SAI: 'sai' };

export default function Home() {
  const { runPreload } = usePreload();
  const sceneRef = useRef(null);
  const heroRef = useRef(null);
  const brandRef = useRef(null);
  const headlineRef = useRef(null);
  const navRef = useRef(null);
  const btnsRef = useRef([]);

  const [phase, setPhase] = useState(PHASE.ESPERA);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => setPhase(PHASE.FIXO) });

      tl.to(sceneRef.current, { opacity: 1, duration: 0.7, ease: 'power2.inOut' });
      tl.from(heroRef.current, { scale: 1.06, opacity: 0, duration: 1.3, ease: 'power2.out' }, '-=0.4');
      tl.from(brandRef.current, { y: -24, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.9');
      tl.from(headlineRef.current, { y: 16, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.45');
      tl.from(navRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const handleModuleClick = useCallback((mod) => {
    if (phase !== PHASE.FIXO) return;

    if (mod.action === 'video') {
      setVideoOpen(true);
      return;
    }

    if (!mod.route) return;

    setPhase(PHASE.SAI);
    runPreload(mod.route);
  }, [phase, runPreload]);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {/* Hero image — full background */}
      <div ref={heroRef} className={styles.hero}>
        <img src="/img/hero-praia.jpg" alt="" className={styles.heroImg} />
        <div className={styles.heroGradientTop} />
        <div className={styles.heroGradientBottom} />
      </div>

      {/* Brand — top-left */}
      <div ref={brandRef} className={styles.brand}>
        <img src="/img/bravia-logo-azul.svg" alt="Bravia" className={styles.wordmark} />
      </div>

      <h1 ref={headlineRef} className={styles.headline}>
        Um lugar à altura<br />dos seus melhores dias.
      </h1>

      {/* Bottom nav bar */}
      <nav ref={navRef} className={styles.nav}>
        {MODULES.map((mod, i) => (
          <button
            key={mod.id}
            ref={el => (btnsRef.current[i] = el)}
            className={`${styles.navBtn} ${phase === PHASE.FIXO && (mod.route || mod.action) ? styles.navBtnActive : ''}`}
            disabled={phase !== PHASE.FIXO || (!mod.route && !mod.action)}
            onClick={() => handleModuleClick(mod)}
          >
            <span className={styles.navIcon}>{mod.icon}</span>
            <span className={styles.navLabel}>{mod.label}</span>
          </button>
        ))}
      </nav>

      {videoOpen && (
        <div className={styles.videoOverlay} onClick={() => setVideoOpen(false)}>
          <button className={styles.videoClose} onClick={() => setVideoOpen(false)}>
            <IconClose />
          </button>
          <video
            className={styles.videoPlayer}
            src="/video/bravia-video.mp4"
            controls
            autoPlay
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
