import { useState, useCallback, useEffect, useRef } from 'react';
import { useTransition } from '@showcase/core';
import styles from './Mod04.module.css';

const TOUR_SRC = 'https://tour.meupasseiovirtual.com/view/j84YeloeZdi';

const CATEGORIES = [
  {
    id: 'terreo',
    label: 'TÉRREO',
    slides: [
      { src: '/img/areas/HALL01.jpg',      caption: 'hall social' },
      { src: '/img/areas/HALL02.jpg',      caption: 'hall social' },
      { src: '/img/areas/HALL03.jpg',      caption: 'hall de acesso' },
      { src: '/img/areas/ACESSO.jpg',      caption: 'portaria e acesso' },
      { src: '/img/areas/Delivery.jpg',    caption: 'delivery' },
      { src: '/img/areas/BICICLETÁRIO.jpg',caption: 'bicicletário' },
      { src: '/img/areas/PET PLACE.jpg',   caption: 'pet place' },
    ],
  },
  {
    id: '3andar',
    label: '3º ANDAR',
    slides: [
      { src: '/img/areas/FITNESS02.jpg',        caption: 'academia fitness' },
      { src: '/img/areas/FITNESS_EXTERNO.jpg',  caption: 'fitness externo' },
      { src: '/img/areas/JOGOS01.jpg',          caption: 'salão de jogos' },
      { src: '/img/areas/JOGOS02.jpg',          caption: 'salão de jogos' },
      { src: '/img/areas/JOGOS_EXTERNO.jpg',    caption: 'espaço de jogos externos' },
      { src: '/img/areas/COWORKING01.jpg',      caption: 'coworking' },
      { src: '/img/areas/COWORKING02.jpg',      caption: 'coworking · salas privativas' },
      { src: '/img/areas/LAVANDERIA.jpg',       caption: 'lavanderia' },
    ],
  },
  {
    id: 'rooftop',
    label: 'ROOFTOP',
    slides: [
      { src: '/img/areas/ROOFTOP01.jpg',        caption: 'rooftop · piscina e solarium' },
      { src: '/img/areas/ROOFTOP02.jpg',        caption: 'rooftop · área de convivência' },
      { src: '/img/areas/ROOFTOP03.jpg',        caption: 'rooftop · vista panorâmica' },
      { src: '/img/areas/ROOFTOP04.jpg',        caption: 'rooftop · churrasqueira e gourmet' },
      { src: '/img/areas/SAUNA.jpg',            caption: 'sauna e spa' },
      { src: '/img/areas/GOURMET01.jpg',        caption: 'espaço gourmet' },
      { src: '/img/areas/CHURRASQUEIRA01.jpg',  caption: 'churrasqueira gourmet' },
      { src: '/img/areas/CHURRASQUEIRA02.jpg',  caption: 'churrasqueira gourmet' },
    ],
  },
];

const ALL_TABS = [
  { id: 'tour', label: 'TOUR VIRTUAL' },
  ...CATEGORIES.map(c => ({ id: c.id, label: c.label })),
];

export default function Mod04() {
  const { closeModule } = useTransition();
  const [activeTab, setActiveTab] = useState('tour');
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const isTour = activeTab === 'tour';
  const slides = isTour ? [] : (CATEGORIES.find(c => c.id === activeTab)?.slides ?? []);

  const goTo = useCallback((index) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 220);
  }, []);

  const handleTabChange = useCallback((id) => {
    setFading(true);
    setTimeout(() => {
      setActiveTab(id);
      setCurrent(0);
      setFading(false);
    }, 220);
  }, []);

  const prev = useCallback(() =>
    goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  const next = useCallback(() =>
    goTo((current + 1) % slides.length), [current, slides.length, goTo]);

  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
  }, [next, prev]);

  useEffect(() => {
    if (isTour) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, isTour]);

  const slide = slides[current];

  return (
    <div className={styles.page}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.brand} onClick={closeModule} style={{ cursor: 'pointer' }}>
          <span className={styles.brandName}>VĒRTICE</span>
          <span className={styles.brandSub}>ANÁLIA FRANCO</span>
        </div>

        <div className={styles.badge}>
          <span className={styles.badgeText}>áreas comuns</span>
        </div>

        <nav className={styles.tabs}>
          {ALL_TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button className={styles.closeBtn} onClick={closeModule} aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── Tour Virtual ────────────────────────────────────────── */}
      {isTour ? (
        <iframe
          className={styles.tourFrame}
          src={TOUR_SRC}
          referrerPolicy="origin"
          allow="fullscreen *; autoplay *; screen-wake-lock *; geolocation *; accelerometer *; gyroscope *; xr-spatial-tracking *; vr *; web-share *;"
          allowFullScreen
        />
      ) : (
      <>
      {/* ── Gallery ─────────────────────────────────────────────── */}
      <div className={styles.gallery} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Anterior">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={`${styles.imageWrap} ${fading ? styles.fading : ''}`}>
          <img
            src={slide.src}
            alt={slide.caption}
            className={styles.image}
          />
          <div className={styles.caption}>{slide.caption}</div>
        </div>

        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Próximo">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

      </div>

      {/* ── Dots ────────────────────────────────────────────────── */}
      <div className={styles.counter}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      </>
      )}

    </div>
  );
}
