import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import VideoModal from '../../components/VideoModal/VideoModal';
import styles from './Home.module.css';

/* ── Module definitions ─────────────────────────────────────────────────── */
const MODULES = [
  { id: '01', label: 'Vídeos',       icon: '/img/icon-video.svg',        route: null,         smallLabel: false },
  { id: '02', label: 'Bairro',       icon: '/img/icon-bairro.svg',       route: '/modulo/02', smallLabel: false },
  { id: '03', label: 'Projeto',      icon: '/img/icon-projeto.svg',      route: '/modulo/03', smallLabel: false },
  { id: '04', label: 'Áreas Comuns', icon: '/img/icon-areas.svg',        route: '/modulo/04', smallLabel: true  },
  { id: '05', label: 'Unidades',     icon: '/img/icon-unidades-btn.svg', route: null,         smallLabel: false },
];

const BTN_TOP = [106, 222, 338, 454, 570]; // px (scaled 0.75× from 1920px Figma, adj for 810 canvas)
const PHASE   = { ESPERA: 'espera', FIXO: 'fixo', SAI: 'sai' };

export default function Home() {
  const { startTransition } = useTransition();

  const sceneRef  = useRef(null);
  const heroRef   = useRef(null);
  const panelRef  = useRef(null);
  const ovalRef   = useRef(null);
  const logoRef   = useRef(null);
  const btnsRef   = useRef([]);

  const [phase, setPhase]         = useState(PHASE.ESPERA);
  const [showVideo, setShowVideo] = useState(false);

  /* ── Entrance animation ─────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => setPhase(PHASE.FIXO) });
      tl.to(sceneRef.current,  { opacity: 1,               duration: 0.6, ease: 'power2.inOut' });
      tl.from(heroRef.current, { scale: 1.05, opacity: 0,  duration: 1.2, ease: 'power2.out'  }, '-=0.3');
      tl.from(panelRef.current,{ x: 50, opacity: 0,        duration: 0.8, ease: 'power3.out'  }, '-=0.8');
      tl.from(ovalRef.current, { opacity: 0, scale: 0.92,  duration: 0.7, ease: 'back.out(1.3)' }, '-=0.5');
      tl.from(logoRef.current, { opacity: 0, y: -12,       duration: 0.5, ease: 'power2.out'  }, '-=0.4');
      tl.from(
        btnsRef.current.filter(Boolean),
        { opacity: 0, x: 28, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
        '-=0.3'
      );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  /* ── Click handler ──────────────────────────────────────────────────── */
  const handleClick = useCallback((mod) => {
    if (phase !== PHASE.FIXO) return;
    if (mod.id === '01') { setShowVideo(true); return; }
    if (!mod.route) return;
    setPhase(PHASE.SAI);

    const tl = gsap.timeline({ onComplete: () => startTransition(mod.route) });
    tl.to(btnsRef.current.filter(Boolean), {
      opacity: 0, x: 28, duration: 0.2,
      stagger: { each: 0.04, from: 'end' }, ease: 'power2.in',
    });
    tl.to(ovalRef.current,  { opacity: 0, scale: 0.94, duration: 0.35, ease: 'power2.in' }, '<');
    tl.to(panelRef.current, { x: 50, opacity: 0,       duration: 0.4,  ease: 'power2.in' }, '-=0.1');
    tl.to(heroRef.current,  { scale: 1.04, opacity: 0, duration: 0.45, ease: 'power2.in' }, '-=0.2');
    tl.to(sceneRef.current, { opacity: 0,              duration: 0.3  }, '-=0.15');
  }, [phase, startTransition]);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {/* ── Hero photo (full background) ──────────────────────────────── */}
      <div ref={heroRef} className={styles.hero}>
        <img src="/img/fachada-1.png" alt="" className={styles.heroImg} />
      </div>

      {/* ── Right dark panel ──────────────────────────────────────────── */}
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.patternOverlay} />
      </div>

      {/* ── Oval brand pill (overlaps photo ↔ panel) ──────────────────── */}
      <img
        ref={ovalRef}
        src="/img/shape-logo.svg"
        alt="Evolution Tatuapé"
        className={styles.oval}
      />

      {/* ── Video modal ───────────────────────────────────────────────── */}
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}

      {/* ── Nav buttons ───────────────────────────────────────────────── */}
      <div className={styles.navBar}>
        {MODULES.map((mod, i) => (
          <button
            key={mod.id}
            ref={el => (btnsRef.current[i] = el)}
            className={`${styles.navBtn} ${(!mod.route && mod.id !== '01') || phase !== PHASE.FIXO ? styles.navBtnOff : ''}`}
            style={{ top: `${BTN_TOP[i]}px` }}
            onClick={() => handleClick(mod)}
          >
            <span className={styles.navCircle}>
              <span className={styles.ring} />
              <img src={mod.icon} alt="" className={styles.icon} />
              <span className={`${styles.navLabel}${mod.smallLabel ? ` ${styles.navLabelSmall}` : ''}`}>{mod.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* ── Zimbel logo top-right ──────────────────────────────────────── */}
      <img
        ref={logoRef}
        src="/img/icon-unidades.svg"
        alt="Zimbel"
        className={styles.zimbelLogo}
      />

    </div>
  );
}
