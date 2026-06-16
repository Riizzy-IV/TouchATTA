import { useState, useRef, useCallback } from 'react';
import styles from './CardCarousel.module.css';

const IconCar  = () => <img src="/SVG/car.svg"  alt="carro" className={styles.distIconImg} />;
const IconWalk = () => <img src="/SVG/walk.svg" alt="a pé"  className={styles.distIconImg} />;

const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

const PALETTES = [
  'linear-gradient(160deg, #0d3a48 0%, #1a7888 100%)',
  'linear-gradient(160deg, #0d3020 0%, #1a6040 100%)',
  'linear-gradient(160deg, #2a1a40 0%, #4a3080 100%)',
  'linear-gradient(160deg, #3a1a10 0%, #7a3820 100%)',
  'linear-gradient(160deg, #1a2a3a 0%, #2a5a7a 100%)',
  'linear-gradient(160deg, #3a2a10 0%, #7a5520 100%)',
  'linear-gradient(160deg, #1a3020 0%, #3a6840 100%)',
  'linear-gradient(160deg, #3a1020 0%, #7a2840 100%)',
];

const SLOT = {
  offset: [0,   360,  630,  850,  1030],
  rotY:   [0,   42,   52,   58,   62],
  scale:  [1,   0.80, 0.68, 0.60, 0.54],
  opac:   [1,   0.85, 0.65, 0.45, 0.25],
};

function getStyle(distance) {
  const abs = Math.min(Math.abs(distance), 4);
  const dir = distance >= 0 ? 1 : -1;
  return {
    transform: `translateX(${dir * SLOT.offset[abs]}px) rotateY(${-dir * SLOT.rotY[abs]}deg) scale(${SLOT.scale[abs]})`,
    opacity: SLOT.opac[abs],
    zIndex: 10 - abs,
    pointerEvents: abs > 2 ? 'none' : 'auto',
  };
}

function parseMinutes(str) {
  return str ? str.replace(/[^0-9]/g, '') : '–';
}

export default function CardCarousel({ items = [] }) {
  const [active, setActive] = useState(0);
  const dragStart = useRef(null);
  const hasDragged = useRef(false);

  const prev = useCallback(() => setActive(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setActive(i => Math.min(items.length - 1, i + 1)), [items.length]);

  const onMouseDown = (e) => { dragStart.current = e.clientX; hasDragged.current = false; };
  const onMouseUp   = (e) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) > 40) { hasDragged.current = true; delta < 0 ? next() : prev(); }
  };
  const onTouchStart = (e) => { dragStart.current = e.touches[0].clientX; hasDragged.current = false; };
  const onTouchEnd   = (e) => {
    if (dragStart.current === null) return;
    const delta = e.changedTouches[0].clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) > 40) { hasDragged.current = true; delta < 0 ? next() : prev(); }
  };
  const onCardClick = (idx) => { if (!hasDragged.current && idx !== active) setActive(idx); };

  if (!items.length) return null;

  return (
    <div className={styles.stage} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={styles.track}>
        {items.map((item, idx) => {
          const dist = idx - active;
          if (Math.abs(dist) > 4) return null;

          return (
            <div
              key={item.id}
              className={styles.card}
              style={getStyle(dist)}
              onClick={() => onCardClick(idx)}
            >
              {item.photo
                ? <img src={item.photo} alt={item.name} className={styles.photo} draggable={false} />
                : <div className={styles.photo} style={{ background: PALETTES[idx % PALETTES.length] }} />
              }
              <div className={styles.overlay} />

              {/* Barra lateral esquerda — badges de distância */}
              <div className={styles.distSidebar}>
                <div className={styles.distBadge}>
                  <div className={styles.distIcon}><IconCar /></div>
                  <span className={styles.distNum}>{parseMinutes(item.car)}</span>
                  <span className={styles.distLabel}>min</span>
                </div>
                <div className={styles.distDivider} />
                <div className={styles.distBadge}>
                  <div className={styles.distIcon}><IconWalk /></div>
                  <span className={styles.distNum}>{parseMinutes(item.walk)}</span>
                  <span className={styles.distLabel}>min</span>
                </div>
              </div>

              {/* Nome no rodapé */}
              <div className={styles.cardBottom}>
                <span className={styles.placeName}>{item.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {active > 0 && (
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Anterior">
          <IconChevronLeft />
        </button>
      )}
      {active < items.length - 1 && (
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Próximo">
          <IconChevronRight />
        </button>
      )}

      <div className={styles.dots}>
        {items.map((item, idx) => (
          <button
            key={item.id}
            className={`${styles.dot} ${idx === active ? styles.dotActive : ''}`}
            onClick={() => setActive(idx)}
            aria-label={`Card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
