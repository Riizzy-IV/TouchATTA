import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import VideoOverlay from '../../components/VideoOverlay/VideoOverlay';
import styles from './Home.module.css';

const IconVideo = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" style={{ fill: 'currentColor', stroke: 'none' }} />
  </svg>
);

const IconLocalizacao = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);

const IconProjeto = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5a1 1 0 0 0 1 1H10v-5.5h4V20.5h3.5a1 1 0 0 0 1-1V10" />
  </svg>
);

const IconAreas = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M2 17c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" />
    <path d="M2 12c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" />
  </svg>
);

const IconUnidades = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
    <path d="M12 3.5V20.5M3.5 12H20.5" />
  </svg>
);

const MODULES = [
  { id: '01', label: 'VÍDEO',        icon: <IconVideo />,       isVideo: true, videoSrc: null },
  { id: '02', label: 'LOCALIZAÇÃO',  icon: <IconLocalizacao />, route: '/modulo/02' },
  { id: '03', label: 'PROJETO',      icon: <IconProjeto />,     route: '/modulo/03' },
  { id: '04', label: 'ÁREAS COMUNS', icon: <IconAreas />,       route: '/modulo/04' },
  { id: '05', label: 'UNIDADES',     icon: <IconUnidades />,    route: '/modulo/05' },
];

const PHASE = { ESPERA: 'espera', FIXO: 'fixo', SAI: 'sai' };

export default function Home() {
  const { startTransition } = useTransition();
  const sceneRef   = useRef(null);
  const bgRef      = useRef(null);
  const panelRef   = useRef(null);
  const logoRef    = useRef(null);
  const navRef     = useRef(null);
  const itemsRef   = useRef([]);

  const [phase, setPhase]       = useState(PHASE.ESPERA);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => setPhase(PHASE.FIXO) });

      tl.to(sceneRef.current,  { opacity: 1,                                duration: 0.7, ease: 'power2.inOut' });
      tl.fromTo(bgRef.current,   { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1,      duration: 1.3, ease: 'power2.out'   }, '-=0.4');
      tl.fromTo(panelRef.current,{ x: -40, opacity: 0 },      { x: 0, opacity: 1,          duration: 0.9, ease: 'power3.out'   }, '-=0.9');
      tl.fromTo(logoRef.current, { opacity: 0, y: 20 },       { opacity: 1, y: 0,          duration: 0.6, ease: 'power2.out'   }, '-=0.5');
      tl.fromTo(itemsRef.current,{ opacity: 0, x: 16 },       { opacity: 1, x: 0,          duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.4');
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const handleModuleClick = useCallback((mod) => {
    if (phase !== PHASE.FIXO) return;

    if (mod.isVideo) {
      if (mod.videoSrc) setVideoSrc(mod.videoSrc);
      return;
    }

    setPhase(PHASE.SAI);

    const tl = gsap.timeline({ onComplete: () => startTransition(mod.route, mod.label) });

    tl.to(itemsRef.current, { opacity: 0, x: 16, duration: 0.2, stagger: { each: 0.03, from: 'end' }, ease: 'power2.in' });
    tl.to(logoRef.current,  { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, '<');
    tl.to(panelRef.current, { x: -50, opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.1');
    tl.to(bgRef.current,    { scale: 1.05, opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=0.2');
    tl.to(sceneRef.current, { opacity: 0, duration: 0.3 }, '-=0.15');
  }, [phase, startTransition]);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {/* Fundo completo — asset único exportado do Figma (painel + torre + régua já compostos) */}
      <img ref={bgRef} className={styles.bg} src="/img/bg-home.avif" alt="" />

      {/* Nuvens em loop sobre o céu, mesmo tratamento do Siver */}
      <video className={styles.clouds} src="/videos/clouds.webm" autoPlay muted loop playsInline />

      {/* Marca, sobreposta ao painel claro do fundo */}
      <div ref={panelRef} className={styles.panelGroup}>
        <div ref={logoRef} className={styles.brand}>
          <img className={styles.logo} src="/img/logo.svg" alt="Eden Sky" />
          <p className={styles.wordmarkMobile}>EDEN SKY</p>
          <div className={styles.taglineBlock}>
            <span className={styles.divider} />
            <p className={styles.tagline}>
              ENTRE O CÉU E A TERRA<br />
              AQUI É O SEU LUGAR
            </p>
          </div>
        </div>
      </div>

      {/* Navegação vertical à direita */}
      <nav ref={navRef} className={styles.navRail}>
        <span className={styles.navSpine} />
        {MODULES.map((mod, i) => (
          <button
            key={mod.id}
            ref={el => (itemsRef.current[i] = el)}
            className={`${styles.navItem} ${mod.isVideo ? styles.navItemActive : ''}`}
            disabled={phase !== PHASE.FIXO}
            onClick={() => handleModuleClick(mod)}
          >
            <span className={styles.navCircle}>
              {mod.icon}
              <span className={styles.ring} />
              <span className={styles.ring} style={{ animationDelay: '0.5s' }} />
            </span>
            <span className={styles.navLabel}>
              {mod.label.split(' ').map((w, k) => <span key={k}>{w}</span>)}
            </span>
          </button>
        ))}
      </nav>

      {videoSrc && <VideoOverlay src={videoSrc} onClose={() => setVideoSrc(null)} />}
    </div>
  );
}
