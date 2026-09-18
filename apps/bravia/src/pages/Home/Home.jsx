import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { usePreload } from '../../context/PreloadContext';
import styles from './Home.module.css';

const IconVideo = () => (
  <img src="/img/icons/btn-video.png" alt="" style={{ display: 'block' }} />
);

const IconLocalizacao = () => (
  <img src="/img/icons/btn-localizacao.png" alt="" style={{ display: 'block' }} />
);

const IconProjeto = () => (
  <img src="/img/icons/btn-projeto.png" alt="" style={{ display: 'block' }} />
);

const IconGaleria = () => (
  <img src="/img/icons/btn-galeria.png" alt="" style={{ display: 'block' }} />
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MODULES = [
  { id: '01', label: 'Vídeo', icon: <IconVideo />, action: 'video', bare: true },
  { id: '02', label: 'Localização', icon: <IconLocalizacao />, route: '/localizacao', bare: true },
  { id: '03', label: 'Projeto', icon: <IconProjeto />, route: '/projeto', bare: true },
  { id: '04', label: 'Galeria', icon: <IconGaleria />, route: null, bare: true },
];

const PHASE = { ESPERA: 'espera', FIXO: 'fixo', SAI: 'sai' };

export default function Home() {
  const { runPreload } = usePreload();
  const sceneRef = useRef(null);
  const symbolRef = useRef(null);
  const wordmarkRef = useRef(null);
  const rightPhotoRef = useRef(null);
  const navRef = useRef(null);
  const btnsRef = useRef([]);

  const [phase, setPhase] = useState(PHASE.ESPERA);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => setPhase(PHASE.FIXO) });

      tl.to(sceneRef.current, { opacity: 1, duration: 0.7, ease: 'power2.inOut' });
      tl.from(symbolRef.current, { y: -16, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
      tl.from(wordmarkRef.current, { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');
      tl.from(rightPhotoRef.current, { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.7');
      tl.from(navRef.current, { x: 24, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
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

      {/* Left panel — aerial pool photo, gold edge doubles as the split line */}
      <div className={styles.leftPhoto}>
        <img src="/img/bravia-panel-esquerda.png" alt="" className={styles.leftPhotoImg} />
      </div>

      {/* Right panel — clubhouse deck at dusk */}
      <div ref={rightPhotoRef} className={styles.rightPhoto}>
        <img src="/img/bravia-bg-clubhouse.jpg" alt="" className={styles.rightPhotoImg} />
        <div className={styles.rightPhotoTint} />
      </div>

      {/* Sun symbol — over the sky, no circle this time */}
      <div ref={symbolRef} className={styles.symbolWrap}>
        <img src="/img/bravia-simbolo-preto.svg" alt="" className={styles.symbol} />
      </div>

      {/* Wordmark */}
      <div ref={wordmarkRef} className={styles.wordmarkClip}>
        <img src="/bravia.png" alt="Brávia" className={styles.wordmarkImg} />
      </div>

      {/* Side nav */}
      <nav ref={navRef} className={styles.nav}>
        {MODULES.map((mod, i) => (
          <button
            key={mod.id}
            ref={el => (btnsRef.current[i] = el)}
            className={`${styles.navBtn} ${phase === PHASE.FIXO && (mod.route || mod.action) ? styles.navBtnActive : ''}`}
            disabled={phase !== PHASE.FIXO || (!mod.route && !mod.action)}
            onClick={() => handleModuleClick(mod)}
          >
            <span className={styles.navLabel}>{mod.label}</span>
            <span className={`${styles.navIcon} ${mod.bare ? styles.navIconBare : ''}`}>{mod.icon}</span>
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
