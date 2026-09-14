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
  { id: 'f1', src: '/img/fachada-1.png',            label: 'Fachada · Vista 1', cat: 'FACHADA' },
  { id: 'academia',    src: '/img/areas/academia.webp',    label: 'Academia',        cat: 'LAZER' },
  { id: 'coworking',   src: '/img/areas/coworking.webp',   label: 'Coworking',       cat: 'LAZER' },
  { id: 'espaco-pet',  src: '/img/areas/espaco-pet.webp',  label: 'Espaço Pet',      cat: 'LAZER' },
  { id: 'pet-care',    src: '/img/areas/pet-care.webp',    label: 'Pet Care',        cat: 'LAZER' },
  { id: 'gourmet',     src: '/img/areas/area-gourmet.webp',label: 'Área Gourmet',    cat: 'LAZER' },
  { id: 'jacuzzi',     src: '/img/areas/jacuzzi.webp',     label: 'Jacuzzi',         cat: 'LAZER' },
  { id: 'bicicletario',src: '/img/areas/bicicletario.webp',label: 'Bicicletário',    cat: 'LAZER' },
  { id: 'hall',        src: '/img/areas/hall-entrada.webp',label: 'Hall de Entrada', cat: 'LAZER' },
  { id: 'mercado',     src: '/img/areas/mini-mercado.webp',label: 'Mini Mercado',    cat: 'LAZER' },
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
        <div className={styles.grid}>
          {IMAGES.map((img, i) => (
            <button key={img.id} className={styles.gridCard} onClick={() => setLightboxIdx(i)}>
              <img src={img.src} alt={img.label} className={styles.gridImg} draggable={false} />
              <div className={styles.gridOverlay}>
                <span className={styles.gridCat}>{img.cat}</span>
                <span className={styles.gridLabel}>{img.label}</span>
              </div>
            </button>
          ))}
        </div>
        <div className={styles.gridNote}>
          <p>Renders 3D · Evolution Tatuapé</p>
          <small>Imagens de representação · sujeito a alteração</small>
        </div>

        {lightboxIdx !== null && (
          <Lightbox images={IMAGES} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </div>
    </div>
  );
}
