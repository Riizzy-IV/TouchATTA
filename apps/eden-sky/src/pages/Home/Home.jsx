import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import VideoOverlay from '../../components/VideoOverlay/VideoOverlay';
import styles from './Home.module.css';

// Círculo de fundo compartilhado pelos módulos "compostos" (ícone + fundo separados)
const NavCircle = () => (
  <img className={styles.navCircleBg} src="/img/icons/nav-circle.svg" alt="" />
);

const NAV_ITEMS = [
  {
    id: '01',
    label: 'VÍDEO',
    isVideo: true,
    videoSrc: '/videos/eden-sky-video.mp4',
    render: () => (
      <>
        <NavCircle />
        <span className={styles.navIconVideo}>
          <img className={styles.navIconVideoRing} src="/img/icons/nav-video-ring.svg" alt="" />
          <img className={styles.navIconVideoPlay} src="/img/icons/nav-video-play.svg" alt="" />
        </span>
      </>
    ),
  },
  {
    id: '02',
    label: 'LOCALIZAÇÃO',
    route: '/modulo/02',
    render: () => <img className={styles.navIconBaked} src="/img/icons/nav-localizacao.svg" alt="" />,
  },
  {
    id: '03',
    label: 'PROJETO',
    route: '/modulo/03',
    render: () => (
      <>
        <NavCircle />
        <img className={styles.navIconInset52} src="/img/icons/nav-projeto.svg" alt="" />
      </>
    ),
  },
  {
    id: '04',
    label: 'GALERIA',
    route: '/modulo/04',
    render: () => (
      <>
        <NavCircle />
        <img className={styles.navIconInset62} src="/img/icons/nav-galeria.svg" alt="" />
      </>
    ),
  },
  {
    id: '05',
    label: 'UNIDADES',
    route: '/modulo/05',
    render: () => <img className={styles.navIconBaked} src="/img/icons/nav-unidades.svg" alt="" />,
  },
];

const PHASE = { ESPERA: 'espera', FIXO: 'fixo', SAI: 'sai' };

export default function Home() {
  const { startTransition } = useTransition();
  const sceneRef  = useRef(null);
  const bgRef     = useRef(null);
  const towerRef  = useRef(null);
  const leafRef   = useRef(null);
  const badgeRef  = useRef(null);
  const navRef    = useRef(null);
  const itemsRef  = useRef([]);

  const [phase, setPhase]       = useState(PHASE.ESPERA);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => setPhase(PHASE.FIXO) });

      tl.to(sceneRef.current,  { opacity: 1,                          duration: 0.7, ease: 'power2.inOut' });
      tl.fromTo(bgRef.current,   { opacity: 0 },              { opacity: 1,          duration: 1,   ease: 'power2.out'   }, '-=0.4');
      tl.fromTo(towerRef.current,{ y: 24, opacity: 0 },       { y: 0, opacity: 1,    duration: 0.9, ease: 'power3.out'   }, '-=0.8');
      tl.fromTo(badgeRef.current,{ scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1,duration: 0.7, ease: 'power2.out'   }, '-=0.6');
      tl.fromTo(leafRef.current, { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.45');
      tl.fromTo(itemsRef.current,{ opacity: 0, x: 16 },       { opacity: 1, x: 0,    duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.4');
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
    tl.to(badgeRef.current, { opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.in' }, '<');
    tl.to(leafRef.current, { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in' }, '<');
    tl.to(towerRef.current, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '-=0.1');
    tl.to(sceneRef.current, { opacity: 0, duration: 0.3 }, '-=0.15');
  }, [phase, startTransition]);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {/* Fundo — foto da piscina, bem apagada, dá profundidade atrás da torre */}
      <div ref={bgRef} className={styles.bg}>
        <img className={styles.bgImg} src="/img/home-bg-pool.webp" alt="" />
      </div>

      {/* Friso dourado — encostado no canto superior esquerdo */}
      <img className={styles.goldCorner} src="/img/dourado.jpg" alt="" />

      {/* Torre — fachada noturna, céu preto do render "estourado" via blend screen */}
      <picture>
        <source media="(max-width: 768px)" srcSet="/img/home-bg-mobile.webp" />
        <img ref={towerRef} className={styles.tower} src="/img/home-building.webp" alt="Eden Sky" />
      </picture>

      {/* Folhagem decorativa sobre o topo do medalhão */}
      <div ref={leafRef} className={styles.leafWrap}>
        <img className={styles.leaf} src="/img/home-leaf-alpha.webp" alt="" />
      </div>

      {/* Medalhão central — marca + tagline */}
      <div ref={badgeRef} className={styles.badge}>
        <div className={styles.badgeOuter} />
        <div className={styles.badgeInner} />
        <div className={styles.badgeContent}>
          <img className={styles.logo} src="/img/home-logo-badge.webp" alt="Eden Sky" />
          <span className={styles.divider} />
          <p className={styles.tagline}>
            ENTRE O CÉU E A TERRA<br />
            AQUI É O SEU LUGAR
          </p>
        </div>
      </div>

      {/* Navegação vertical à direita, escalonada como no Figma */}
      <nav ref={navRef} className={styles.navRail}>
        {NAV_ITEMS.map((mod, i) => (
          <button
            key={mod.id}
            ref={el => (itemsRef.current[i] = el)}
            className={`${styles.navItem} ${styles[`navItem${mod.id}`]}`}
            disabled={phase !== PHASE.FIXO}
            onClick={() => handleModuleClick(mod)}
          >
            <span className={styles.navLabel}>{mod.label}</span>
            <span className={styles.navCircle}>{mod.render()}</span>
          </button>
        ))}
      </nav>

      {videoSrc && <VideoOverlay src={videoSrc} onClose={() => setVideoSrc(null)} />}
    </div>
  );
}
