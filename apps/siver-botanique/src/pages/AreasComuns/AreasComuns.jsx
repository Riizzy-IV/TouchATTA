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
  { slug: 'beach-tennis',     label: 'Beach Tennis' },
  { slug: 'quadra',           label: 'Quadra Poliesportiva' },
  { slug: 'fitness',          label: 'Espaço Fitness' },
  { slug: 'academia',         label: 'Academia' },
  { slug: 'teen',             label: 'Espaço Teen' },
  { slug: 'playground',       label: 'Playground' },
  { slug: 'brinquedoteca',    label: 'Brinquedoteca' },
  { slug: 'churrasqueira',    label: 'Churrasqueira' },
  { slug: 'salao-de-festas',  label: 'Salão de Festas' },
  { slug: 'petplace',         label: 'Pet Place' },
];

export default function AreasComuns() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [phase, setPhase] = useState('video'); // 'video' | 'content'
  const [lightbox, setLightbox] = useState(null);

  const videoRef     = useRef(null);
  const overlayRef   = useRef(null);
  const skipRef      = useRef(null);
  const contentRef   = useRef(null);
  const lightboxRef  = useRef(null);
  const lightboxImgRef = useRef(null);

  useEffect(() => {
    if (!lightbox) return;
    gsap.fromTo(lightboxRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(lightboxImgRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });

    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  useEffect(() => {
    if (phase !== 'video') return;
    // Fade in skip button after 1s
    gsap.fromTo(skipRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, delay: 1.2, ease: 'power2.out' }
    );
  }, [phase]);

  const revealContent = () => {
    if (phase === 'content') return;
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        setPhase('content');
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, delay: 0.1 });
      },
    });
  };

  return (
    <div className={styles.scene}>

      {/* ── Intro vídeo ── */}
      {phase === 'video' && (
        <div className={styles.videoWrap}>
          <video
            ref={videoRef}
            className={styles.video}
            src="/videos/volei-2-opt.mp4"
            autoPlay
            muted
            playsInline
            onEnded={revealContent}
          />
          <button
            ref={skipRef}
            className={styles.skipBtn}
            onClick={revealContent}
          >
            pular →
          </button>
        </div>
      )}

      {/* Overlay de transição */}
      <div className={styles.transitionOverlay} ref={overlayRef} />

      {/* ── Conteúdo principal ── */}
      {phase === 'content' && (
        <div className={styles.content} ref={contentRef}>

          {/* Top bar */}
          <header className={styles.topBar}>
            <img
              src="/img/logo.avif"
              className={styles.logoSmall}
              draggable={false}
              onClick={() => startTransition('/', '')}
              style={{ cursor: 'pointer' }}
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
                    src={`/img/areas/${area.slug}/${area.slug}.avif`}
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
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className={styles.lightbox} ref={lightboxRef} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>
            <IconClose />
          </button>
          <figure className={styles.lightboxFigure} onClick={(e) => e.stopPropagation()}>
            <img
              ref={lightboxImgRef}
              src={`/img/areas/${lightbox.slug}/${lightbox.slug}.avif`}
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
