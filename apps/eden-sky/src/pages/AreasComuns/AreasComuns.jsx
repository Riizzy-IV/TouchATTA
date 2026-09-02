import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './AreasComuns.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AREAS = [
  { slug: 'piscina',       label: 'Piscina' },
  { slug: 'parquinho',     label: 'Parquinho' },
  { slug: 'academia',      label: 'Academia' },
  { slug: 'gourmet',       label: 'Espaço Gourmet' },
  { slug: 'jogos',         label: 'Salão de Jogos' },
  { slug: 'poliesportiva', label: 'Quadra Poliesportiva' },
  { slug: 'pilates',       label: 'Espaço Pilates' },
  { slug: 'salao-festas',  label: 'Salão de Festas' },
  { slug: 'spa',           label: 'SPA' },
  { slug: 'lobby',         label: 'Lobby' },
  { slug: 'delivery',      label: 'Delivery Room' },
  { slug: 'salao-beleza',  label: 'Salão de Beleza' },
];

export default function AreasComuns() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [lightbox, setLightbox] = useState(null);

  const contentRef     = useRef(null);
  const lightboxRef    = useRef(null);
  const lightboxImgRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    gsap.fromTo(lightboxRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(lightboxImgRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });

    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <div className={styles.scene}>
      <div className={styles.content} ref={contentRef}>

        {/* Top bar */}
        <header className={styles.topBar}>
          <img
            src="/img/logo.svg"
            className={styles.logoSmall}
            alt="Eden Sky"
            draggable={false}
            onClick={() => startTransition('/', '')}
          />
          <nav className={styles.topTabs}>
            <span className={styles.pageTitle}>áreas comuns</span>
          </nav>
          <button className={styles.closeBtn} onClick={openDrawer}>
            <IconClose />
          </button>
        </header>

        <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/04" />

        {/* Corpo */}
        <div className={styles.body}>
          <div className={styles.grid}>
            {AREAS.map(area => (
              <button
                key={area.slug}
                className={styles.card}
                onClick={() => setLightbox(area)}
              >
                <img
                  src={`/img/areas/${area.slug}.avif`}
                  alt={area.label}
                  className={styles.cardImg}
                  draggable={false}
                />
                <div className={styles.cardOverlay} />
                <span className={styles.cardLabel}>{area.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} ref={lightboxRef} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>
            <IconClose />
          </button>
          <figure className={styles.lightboxFigure} onClick={(e) => e.stopPropagation()}>
            <img
              ref={lightboxImgRef}
              src={`/img/areas/${lightbox.slug}.avif`}
              alt={lightbox.label}
              className={styles.lightboxImg}
              draggable={false}
            />
            <figcaption className={styles.lightboxCaption}>{lightbox.label}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
