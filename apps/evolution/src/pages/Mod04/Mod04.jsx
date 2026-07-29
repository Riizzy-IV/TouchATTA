import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Mod04.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChevronL = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M15 18L9 12L15 6" />
  </svg>
);

const IconChevronR = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M9 18L15 12L9 6" />
  </svg>
);

const IMAGES = [
  { id: 'f1', src: '/img/fachada-1.png',  label: 'Fachada · Vista 1', cat: 'FACHADA'  },
  { id: 'f2', src: '/img/fachada-2.png',  label: 'Fachada · Vista 2', cat: 'FACHADA'  },
  { id: 'g1', src: '/img/gourmet-1.png',  label: 'Área Gourmet',      cat: 'LAZER'    },
];

function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const overlayRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.25, onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx(i => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, images.length]);

  return (
    <div ref={overlayRef} className={styles.lightbox} onClick={close}>
      <button className={styles.lightboxClose} onClick={close}><IconClose /></button>
      {idx > 0 && (
        <button className={`${styles.lightboxNav} ${styles.lightboxNavL}`} onClick={e => { e.stopPropagation(); setIdx(i => i - 1); }}>
          <IconChevronL />
        </button>
      )}
      <div className={styles.lightboxImgWrap} onClick={e => e.stopPropagation()}>
        <img src={images[idx].src} alt={images[idx].label} className={styles.lightboxImg} draggable={false} />
        <div className={styles.lightboxCaption}>
          <span className={styles.lightboxCat}>{images[idx].cat}</span>
          <span className={styles.lightboxLabel}>{images[idx].label}</span>
          <span className={styles.lightboxCount}>{idx + 1} / {images.length}</span>
        </div>
      </div>
      {idx < images.length - 1 && (
        <button className={`${styles.lightboxNav} ${styles.lightboxNavR}`} onClick={e => { e.stopPropagation(); setIdx(i => i + 1); }}>
          <IconChevronR />
        </button>
      )}
    </div>
  );
}

export default function Mod04() {
  const { closeModule } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [lightboxIdx, setLightboxIdx] = useState(null);

  return (
    <div className={styles.scene}>

      <header className={styles.topBar}>
        <img src="/img/zimbel-logo.svg" alt="Zimbel" className={styles.topLogo} draggable={false} onClick={closeModule} style={{ cursor: 'pointer' }} />
        <h2 className={styles.topTitle}>Galeria</h2>
        <button className={styles.closeBtn} onClick={openDrawer}><IconClose /></button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/04" />

      <div className={styles.body}>
        {/* Featured */}
        <div className={styles.featured} onClick={() => setLightboxIdx(0)} role="button" tabIndex={0}>
          <img src={IMAGES[0].src} alt={IMAGES[0].label} className={styles.featuredImg} draggable={false} />
          <div className={styles.featuredOverlay}>
            <span className={styles.featuredCat}>{IMAGES[0].cat}</span>
            <span className={styles.featuredLabel}>{IMAGES[0].label}</span>
            <span className={styles.featuredHint}>Clique para ampliar</span>
          </div>
        </div>

        {/* Thumbnails column */}
        <div className={styles.thumbCol}>
          {IMAGES.slice(1).map((img, i) => (
            <div key={img.id} className={styles.thumb} onClick={() => setLightboxIdx(i + 1)} role="button" tabIndex={0}>
              <img src={img.src} alt={img.label} className={styles.thumbImg} draggable={false} />
              <div className={styles.thumbOverlay}>
                <span className={styles.thumbCat}>{img.cat}</span>
                <span className={styles.thumbLabel}>{img.label}</span>
              </div>
            </div>
          ))}
          <div className={styles.thumbNote}>
            <p>Renders 3D · Evolution Tatuapé</p>
            <small>Imagens de representação · sujeito a alteração</small>
          </div>
        </div>

        {lightboxIdx !== null && (
          <Lightbox images={IMAGES} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </div>
    </div>
  );
}
