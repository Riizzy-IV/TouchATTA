import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import ComparadorView from './ComparadorView';
import DisponibilidadeView from './DisponibilidadeView';
import styles from './Mod05.module.css';

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

const IconExpand = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const IconGrid = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1" />
    <rect x="13" y="3" width="8" height="8" rx="1" />
    <rect x="3" y="13" width="8" height="8" rx="1" />
    <rect x="13" y="13" width="8" height="8" rx="1" />
  </svg>
);

const IconBed = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17v-9a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3" />
    <path d="M2 17h20" />
    <path d="M2 20v-3" />
    <path d="M22 20v-6a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v3" />
    <path d="M22 17v3" />
  </svg>
);

const IconSun = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const IconRoof = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11L12 4l9 7" />
    <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
  </svg>
);

const IconGrill = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="8" rx="8" ry="4" />
    <path d="M4 8v3a8 4 0 0 0 16 0V8M8 15v4M16 15v4M6 22h12" />
  </svg>
);

const IconCar = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
    <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Z" />
    <circle cx="7.5" cy="15.5" r="1.2" />
    <circle cx="16.5" cy="15.5" r="1.2" />
  </svg>
);

/* ── Data ───────────────────────────────────────────────────────────────── *
 * Dados oficiais (metragem/ambientes) repassados pelo cliente por unidade.
 */
const PLANTAS = [
  {
    id: 'unidade-11', src: '/img/plantas-humanizadas/unidade-11.webp',
    unidade: 'Unidade 11', area: '44,30 m²', pill: '44,30m²',
    dorms: '2 dorms.', features: [{ icon: 'grill', label: 'Varanda Gourmet' }, { icon: 'sun', label: 'Terraço descoberto' }, { icon: 'car', label: '1 vaga de garagem' }],
  },
  {
    id: 'unidades-12-17', src: '/img/plantas-humanizadas/unidades-12-17.webp',
    unidade: 'Unidades 12, 13, 14, 15, 16 e 17', area: '34,97 m²', pill: '34,97m²',
    dorms: '2 dorms.', features: [{ icon: 'sun', label: 'Terraço descoberto' }],
  },
  {
    id: 'unidade-18', src: '/img/plantas-humanizadas/unidade-18.webp',
    unidade: 'Unidade 18', area: '40,40 m²', pill: '40,40m²',
    dorms: '2 dorms.', features: [{ icon: 'sun', label: 'Terraço descoberto' }],
  },
  {
    id: 'unidades-21-31', src: '/img/plantas-humanizadas/unidades-21-31.webp',
    unidade: 'Unidades 21 e 31', area: '44,30 m²', pill: '44,30m²',
    dorms: '2 dorms.', features: [{ icon: 'grill', label: 'Varanda Gourmet' }, { icon: 'car', label: 'Opção com/sem vaga' }],
  },
  {
    id: 'unidades-22-27-32-37', src: '/img/plantas-humanizadas/unidades-22-27-32-37.webp',
    unidade: 'Unidades 22 a 27 e 32 a 37', area: '34,97 m²', pill: '34,97m²',
    dorms: '2 dorms.', features: [],
  },
  {
    id: 'unidades-28-38', src: '/img/plantas-humanizadas/unidades-28-38.webp',
    unidade: 'Unidades 28 e 38', area: '40,40 m²', pill: '40,40m²',
    dorms: '2 dorms.', features: [],
  },
  {
    id: 'unidade-41', src: '/img/plantas-humanizadas/unidade-41.webp',
    unidade: 'Unidade 41', area: '49,90 m² + Terraço descoberto', pill: '49,90m²',
    dorms: '2 dorms c/ 1 suíte', features: [{ icon: 'grill', label: 'Varanda Gourmet' }, { icon: 'sun', label: 'Área externa' }, { icon: 'car', label: '1 vaga de garagem' }],
  },
  {
    id: 'unidades-51-61-71-81-91', src: '/img/plantas-humanizadas/unidades-51-61-71-81-91.webp',
    unidade: 'Unidades 51, 61, 71, 81 e 91', area: '49,90 m²', pill: '49,90m²',
    dorms: '2 dorms c/ 1 suíte', features: [{ icon: 'grill', label: 'Varanda Gourmet' }, { icon: 'car', label: '1 vaga de garagem' }],
  },
  {
    id: 'unidades-52-62-72-82-92', src: '/img/plantas-humanizadas/unidades-52-62-72-82-92.webp',
    unidade: 'Unidades 52, 62, 72, 82 e 92', area: '38,96 m²', pill: '38,96m²',
    dorms: '2 dorms.', features: [],
  },
  {
    id: 'unidades-53-63-73-83-93', src: '/img/plantas-humanizadas/unidades-53-63-73-83-93.webp',
    unidade: 'Unidades 53, 63, 73, 83 e 93', area: '44,74 m²', pill: '44,74m²',
    dorms: '2 dorms.', features: [{ icon: 'grill', label: 'Varanda Gourmet' }, { icon: 'car', label: '1 vaga de garagem' }],
  },
];

const FEATURE_ICONS = { sun: IconSun, roof: IconRoof, grill: IconGrill, car: IconCar };

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
        <img src={images[idx].src} alt={images[idx].unidade} className={styles.lightboxImg} draggable={false} />
        <div className={styles.lightboxCaption}>
          <span className={styles.lightboxLabel}>{images[idx].unidade}{images[idx].area ? ` · ${images[idx].area}` : ''}</span>
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

export default function Mod05() {
  const { closeModule } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [section, setSection] = useState('plantas'); // 'plantas' | 'comparador' | 'disponibilidade'
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const cardRef = useRef(null);
  const scrollRef = useRef(null);

  const plan = PLANTAS[active];

  const scrollTabs = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }, [active]);

  return (
    <div className={styles.scene}>

      <header className={styles.topBar}>
        <img src="/img/zimbel-logo.svg" alt="Zimbel" className={styles.topLogo} draggable={false} onClick={closeModule} style={{ cursor: 'pointer' }} />
        <h2 className={styles.topTitle}>Unidades</h2>

        <div className={styles.sectionSwitch}>
          <button
            className={`${styles.sectionBtn} ${section === 'plantas' ? styles.sectionBtnActive : ''}`}
            onClick={() => setSection('plantas')}
          >
            Plantas
          </button>
          <button
            className={`${styles.sectionBtn} ${section === 'comparador' ? styles.sectionBtnActive : ''}`}
            onClick={() => setSection('comparador')}
          >
            Comparador de Unidades
          </button>
          <button
            className={`${styles.sectionBtn} ${section === 'disponibilidade' ? styles.sectionBtnActive : ''}`}
            onClick={() => setSection('disponibilidade')}
          >
            Disponibilidade
          </button>
        </div>

        <button className={styles.closeBtn} onClick={openDrawer}><IconClose /></button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/05" />

      <div className={styles.body}>
      {section === 'comparador' ? (
        <ComparadorView />
      ) : section === 'disponibilidade' ? (
        <DisponibilidadeView />
      ) : (
      <>
        <div className={styles.tabsBar}>
          <button className={styles.tabArrow} onClick={() => scrollTabs(-1)}><IconChevronL /></button>
          <div className={styles.tabsScroll} ref={scrollRef}>
            {PLANTAS.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabIcon}><IconGrid /></span>
                {p.pill}
              </button>
            ))}
          </div>
          <button className={styles.tabArrow} onClick={() => scrollTabs(1)}><IconChevronR /></button>
        </div>

        <div className={styles.content} ref={cardRef}>
          <div className={styles.planCard}>
            <img src={plan.src} alt={plan.unidade} className={styles.planImg} draggable={false} />
            <button className={styles.expandBtn} onClick={() => setLightbox(true)}><IconExpand /></button>
          </div>

          <div className={styles.info}>
            <h1 className={styles.infoArea}>{plan.area ?? plan.dorms.toUpperCase()}</h1>
            <p className={styles.infoSub}>
              PLANTA TIPO · {plan.unidade.toUpperCase()}
            </p>
            <div className={styles.infoDivider} />
            <div className={styles.specsRow}>
              <span className={styles.spec}>
                <span className={styles.specIcon}><IconBed /></span>
                {plan.dorms}
              </span>
              {plan.features.map(f => {
                const Icon = FEATURE_ICONS[f.icon];
                return (
                  <span className={styles.spec} key={f.label}>
                    <span className={styles.specIcon}><Icon /></span>
                    {f.label}
                  </span>
                );
              })}
            </div>
            <p className={styles.infoNote}>* Metragens e configurações sujeitas a alteração conforme memorial descritivo</p>
          </div>
        </div>

        {lightbox && (
          <Lightbox images={PLANTAS} startIndex={active} onClose={() => setLightbox(false)} />
        )}
      </>
      )}
      </div>
    </div>
  );
}
