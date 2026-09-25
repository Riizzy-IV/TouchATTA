import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import VideoOverlay from '../../components/VideoOverlay/VideoOverlay';
import styles from './Home.module.css';

const IconVideo = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.7v6.6l5.5-3.3L10 8.7Z" />
  </svg>
);

/* Ícones do Figma (Localização 84:156, Projeto 84:163) — SVG preenchido #2E4058 */
const IconLocalizacao = () => (
  <img src="/img/icons/icone-localizacao.svg" alt="" draggable={false} />
);

const IconProjeto = () => (
  <img src="/img/icons/icone-projeto.svg" alt="" draggable={false} />
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

/* x/y = centro do círculo em % da cena (escada ascendente, como no Figma) */
const NAV_ITEMS = [
  { id: '01', label: 'Vídeo Conceito', icon: IconVideo,       ready: true,  x: 50.0, y: 79.1, video: 'https://www.youtube.com/watch?v=tPDu4uDT3GQ' },
  { id: '02', label: 'Localização',    icon: IconLocalizacao, ready: true,  x: 58.6, y: 72.3, route: '/modulo/02' },
  { id: '03', label: 'Projeto',        icon: IconProjeto,     ready: true,  x: 67.2, y: 65.4, route: '/modulo/03' },
  { id: '04', label: 'Galeria',        icon: IconGaleria,     ready: true,  x: 75.8, y: 58.6, route: '/modulo/04' },
  { id: '05', label: 'Sócio',          icon: IconSocio,       ready: true,  x: 84.4, y: 51.7, route: '/modulo/05' },
];

const MOBILE_BP = 768;

export default function Home() {
  const { startTransition } = useTransition();
  const sceneRef = useRef(null);
  const coverRef = useRef(null);
  const navRef   = useRef(null);
  const [mobile, setMobile] = useState(() => window.innerWidth <= MOBILE_BP);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= MOBILE_BP);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });
      const tl = gsap.timeline();
      tl.to(sceneRef.current, { opacity: 1, duration: 0.7, ease: 'power2.inOut' });
      if (coverRef.current) tl.from(coverRef.current, { scale: 1.04, duration: 1.6, ease: 'power2.out' }, '-=0.5');
      tl.from(navRef.current.children, { y: 18, opacity: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out' }, '-=1');
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {mobile ? (
        /* Mobile: foto RBC_06 Bar Molhado em recorte vertical + logo (Figma 120:27) e frase */
        <div className={styles.mobileHero}>
          <img src="/img/home-mobile.webp" alt="" className={styles.mobileBg} draggable={false} />
          <div className={styles.mobileShade} />
          <div className={styles.mobileText}>
            <img src="/img/logo-reserva.svg" alt="Reserva Beach Club" className={styles.mobileLogo} draggable={false} />
            <p className={styles.mobileTagline}>O clube de praia feito para transformar Alphaville.</p>
          </div>
        </div>
      ) : (
        /* Desktop: capa do Figma [ATTA] Show Case 1 (1920×1080) — logo, frase e foto já compostos */
        <div className={styles.coverWrap}>
          <img
            ref={coverRef}
            src="/img/home-capa.webp"
            alt="Reserva Beach Club — O clube de praia feito para transformar Alphaville."
            className={styles.cover}
            draggable={false}
          />
        </div>
      )}

      <nav ref={navRef} className={styles.nav}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${styles.navBtn} ${item.ready ? styles.navBtnActive : ''}`}
              disabled={!item.ready}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => {
                if (item.video) setVideoSrc(item.video);
                else if (item.route) startTransition(item.route, item.label);
              }}
            >
              <span className={styles.navIcon}><Icon /></span>
              <span className={styles.navStem} />
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {videoSrc && (
        <VideoOverlay src={videoSrc} onClose={() => setVideoSrc(null)} />
      )}
    </div>
  );
}
