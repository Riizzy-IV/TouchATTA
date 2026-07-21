import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import VideoOverlay from '../../components/VideoOverlay/VideoOverlay';
import { useTransition } from '@showcase/core';
import styles from './Home.module.css';

const MODULES = [
  { id: '01', label: 'Vídeos',       icon: '/img/home/icon-video.svg',    isVideo: true,  videoSrc: 'https://www.youtube.com/watch?v=iy-4Hjeyk8k' },
  { id: '02', label: 'Bairro',       icon: '/img/home/icon-bairro.svg',   isVideo: false, route: '/modulo/02' },
  { id: '03', label: 'Projeto',      icon: '/img/home/icon-projeto.svg',  isVideo: false, route: '/modulo/03' },
  { id: '04', label: 'Áreas Comuns', icon: '/img/home/icon-areas.svg',    isVideo: false, route: '/modulo/04' },
  { id: '05', label: 'Unidades',     icon: '/img/home/icon-unidades.svg', isVideo: false, route: '/modulo/05' },
];

const PHASE = { ESPERA: 'espera', FIXO: 'fixo', SAI: 'sai' };

export default function Home() {
  const { startTransition } = useTransition();
  const sceneRef   = useRef(null);
  const cardRef    = useRef(null);
  const taglineRef = useRef(null);
  const navBarRef  = useRef(null);
  const tilesRef   = useRef([]);

  const [phase, setPhase]       = useState(PHASE.ESPERA);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current,    { autoAlpha: 0, x: -50 });
      gsap.set(taglineRef.current, { autoAlpha: 0, y: 22 });
      gsap.set(navBarRef.current,  { autoAlpha: 0, y: 32 });
      tilesRef.current.forEach(t => { if (t) gsap.set(t, { autoAlpha: 0, scale: 0.82 }); });

      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          setPhase(PHASE.FIXO);
          // Animação de levitação contínua — cada tile com ritmo diferente
          const floatParams = [
            { y: -10, duration: 2.8 },
            { y: -8,  duration: 3.4 },
            { y: -12, duration: 3.1 },
          ];
          tilesRef.current.forEach((tile, i) => {
            if (!tile) return;
            const { y, duration } = floatParams[i];
            gsap.to(tile, {
              y,
              duration,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: i * 0.5,
            });
          });
        },
      });

      tl.to(cardRef.current, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' });

      tl.to(taglineRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');

      tl.to(tilesRef.current.filter(Boolean), {
        autoAlpha: 1, scale: 1,
        duration: 0.38, ease: 'back.out(1.3)',
        stagger: { each: 0.1 },
      }, '-=0.2');

      tl.to(navBarRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1');
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const handleModuleClick = useCallback((mod) => {
    if (phase !== PHASE.FIXO) return;

    if (mod.isVideo) {
      setVideoSrc(mod.videoSrc);
      return;
    }

    setPhase(PHASE.SAI);

    // Para a levitação antes de sair
    tilesRef.current.filter(Boolean).forEach(t => gsap.killTweensOf(t, 'y'));

    const tl = gsap.timeline({
      onComplete: () => startTransition(mod.route, mod.label),
    });

    tl.to(navBarRef.current, { autoAlpha: 0, y: 24, duration: 0.22, ease: 'power2.in' });
    tl.to(tilesRef.current.filter(Boolean), { autoAlpha: 0, scale: 0.88, duration: 0.18, stagger: 0.06 }, '<');
    tl.to(taglineRef.current, { autoAlpha: 0, y: -14, duration: 0.22, ease: 'power2.in' }, '<+=0.04');
    tl.to(cardRef.current, { autoAlpha: 0, x: -40, duration: 0.3, ease: 'power2.in' }, '-=0.1');
    tl.to(sceneRef.current, { autoAlpha: 0, duration: 0.35 }, '-=0.1');
  }, [phase, startTransition]);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {/* BG: lifestyle (esquerda) */}
      <div className={styles.bgLifestyle}>
        <img src="/img/home/lifestyle-bg.avif" alt="" className={styles.bgImg} fetchpriority="high" decoding="async" />
      </div>

      {/* BG: fachada (centro-direita) */}
      <div className={styles.bgFachada}>
        <img
          src="/img/home/fachada-bg.avif"
          alt=""
          className={styles.bgFachadaImg}
          fetchpriority="high"
          decoding="async"
        />
        <div className={styles.bgFachadaGrad} />
      </div>


      {/* Retângulos decorativos (mix-blend-overlay) */}
      <div className={styles.decoRect1} />
      <div className={styles.decoRect2} />

      {/* Régua vertical direita — top half */}
      <div className={`${styles.ruler} ${styles.rulerTop}`}>
        <div className={styles.rulerRotate}>
          <img src="/img/home/ruler.svg" alt="" className={styles.rulerImg} />
        </div>
      </div>
      {/* Régua vertical direita — bottom half */}
      <div className={`${styles.ruler} ${styles.rulerBottom}`}>
        <div className={styles.rulerRotate}>
          <img src="/img/home/ruler.svg" alt="" className={styles.rulerImg} />
        </div>
      </div>

      {/* Zimbel top-right */}
      <div className={styles.zimbelWrap}>
        <img src="/img/home/zimbel-logo.svg" alt="Zimbel" className={styles.zimbelLogo} />
      </div>

      {/* Card frosted glass com logo */}
      <div ref={cardRef} className={styles.logoCard}>
        <div className={styles.logoCardBar} />
        <div className={styles.logoCardContent}>
          <img src="/img/home/vertice-wordmark.svg" alt="Vértice Anália Franco" className={styles.logoWordmark} />
        </div>
      </div>

      {/* Tiles flutuantes de amenidades — TEMPORARIAMENTE OCULTOS */}
      {/* <div ref={el => (tilesRef.current[0] = el)} className={`${styles.floatTile} ${styles.tileGym}`}>
        <img src="/img/home/icon-gym.svg" alt="" />
      </div>
      <div ref={el => (tilesRef.current[1] = el)} className={`${styles.floatTile} ${styles.tileService}`}>
        <img src="/img/home/icon-service.svg" alt="" />
      </div>
      <div ref={el => (tilesRef.current[2] = el)} className={`${styles.floatTile} ${styles.tilePool}`}>
        <img src="/img/home/icon-pool.svg" alt="" />
      </div> */}

      {/* Tagline */}
      <div ref={taglineRef} className={styles.tagline}>
        <div className={styles.taglineAccent} />
        <p className={styles.taglineText}>
          O futuro <strong>agradece</strong><br />suas escolhas
        </p>
      </div>

      {/* Barra de navegação inferior */}
      <nav ref={navBarRef} className={styles.navBar}>
        {MODULES.map((mod, i) => (
          <button
            key={mod.id}
            className={`${styles.navItem}${i < MODULES.length - 1 ? ' ' + styles.navItemDivider : ''}`}
            disabled={phase !== PHASE.FIXO}
            onClick={() => handleModuleClick(mod)}
          >
            <span className={styles.navIconBox}>
              <img src={mod.icon} alt="" className={styles.navIcon} />
            </span>
            <span className={styles.navLabel}>{mod.label}</span>
          </button>
        ))}
      </nav>

      {videoSrc && (
        <VideoOverlay src={videoSrc} onClose={() => setVideoSrc(null)} />
      )}
    </div>
  );
}
