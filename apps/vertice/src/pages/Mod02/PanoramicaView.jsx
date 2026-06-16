import { useState } from 'react';
import styles from './PanoramicaView.module.css';

const PINS = [
  { id: '01', name: 'ESTAÇÃO ANÁLIA FRANCO',  cat: 'metro',    walk: '6 min',  car: '3 min', x: 30, y: 56 },
  { id: '02', name: 'SUPERMERCADO NEGREIROS', cat: 'market',   walk: '7 min',  car: '3 min', x: 46, y: 61 },
  { id: '03', name: 'HOSPITAL VITÓRIA',        cat: 'hospital', walk: '10 min', car: '5 min', x: 26, y: 49 },
  { id: '04', name: 'SHOPPING ANÁLIA FRANCO', cat: 'shopping', walk: '12 min', car: '5 min', x: 18, y: 43 },
  { id: '05', name: 'ACADEMIA SMARTFIT',       cat: 'gym',      walk: '12 min', car: '5 min', x: 64, y: 53 },
  { id: '06', name: 'PARQUE CERET',            cat: 'park',     walk: '17 min', car: '7 min', x: 11, y: 41 },
  { id: '07', name: 'PADARIA ANÁLIA',          cat: 'food',     walk: '5 min',  car: '3 min', x: 55, y: 59 },
  { id: '08', name: 'FARMÁCIA ULTRAFARMA',     cat: 'pharmacy', walk: '8 min',  car: '4 min', x: 77, y: 51 },
];

const Icon = ({ cat, size = 22 }) => {
  const s = { width: size, height: size };
  const c = 'currentColor';
  const sw = 1.3;
  switch (cat) {
    case 'metro': // trem / metrô
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3" width="14" height="14" rx="3" stroke={c} strokeWidth={sw}/>
          <path d="M5 10h14" stroke={c} strokeWidth={sw}/>
          <circle cx="8.5" cy="14" r="1.2" fill={c}/>
          <circle cx="15.5" cy="14" r="1.2" fill={c}/>
          <path d="M8 17l-2 3M16 17l2 3" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
          <path d="M9 3V1M15 3V1" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      );
    case 'market': // carrinho de supermercado
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M1 1h3l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.61L22 6H6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="21" r="1.5" stroke={c} strokeWidth={sw}/>
          <circle cx="19" cy="21" r="1.5" stroke={c} strokeWidth={sw}/>
        </svg>
      );
    case 'hospital': // cruz médica
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke={c} strokeWidth={2.2} strokeLinecap="round"/>
        </svg>
      );
    case 'shopping': // sacola de compras
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 7h18l-3-5H6z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/>
          <rect x="3" y="7" width="18" height="14" rx="1" stroke={c} strokeWidth={sw}/>
          <path d="M9 11a3 3 0 006 0" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      );
    case 'gym': // haltere
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M6.5 8v8M17.5 8v8" stroke={c} strokeWidth={2.5} strokeLinecap="round"/>
          <path d="M4 10v4M20 10v4" stroke={c} strokeWidth={2.5} strokeLinecap="round"/>
          <path d="M6.5 12h11" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      );
    case 'park': // árvore
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 3L5 13h4.5L7 20h10l-2.5-7H19L12 3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/>
        </svg>
      );
    case 'food': // pão / padaria
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M6 8c0-3 2-5 6-5s6 2 6 5c1.5.5 2 1.5 2 3 0 2-1.3 3-3 3H7c-1.7 0-3-1-3-3 0-1.5.5-2.5 2-3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/>
          <path d="M9 20h6M12 14v6" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      );
    case 'pharmacy': // pílula
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="9" width="18" height="6" rx="3" stroke={c} strokeWidth={sw}/>
          <path d="M12 9v6" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      );
    default: return null;
  }
};

const CarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M5 11l1.5-4.5h11L19 11M3 16h18M6 19a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11h18v5H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export default function PanoramicaView() {
  const [activePin, setActivePin] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);

  return (
    <div className={styles.root}>

      {/* ── Canvas ──────────────────────────────────────────────────────────── */}
      <div className={styles.canvas}>

        <img
          src="/img/panoramica_placeholder.png"
          alt="Panorâmica Anália Franco"
          className={styles.panoramicImg}
          draggable={false}
        />

        <div className={styles.overlay} />

        {/* Marcador do empreendimento */}
        <div className={styles.verticeMarker} style={{ left: '50%', top: '34%' }}>
          <div className={styles.verticeBox}>
            <span className={styles.verticeName}>VĒRTICE</span>
          </div>
          <div className={styles.verticeLine} />
          <div className={styles.verticeDot} />
        </div>

        {/* Pins */}
        {PINS.map((pin) => {
          const isActive = activePin === pin.id;
          const isOpen = isActive || hoveredPin === pin.id;
          /* card vai para a esquerda se o pin estiver na metade direita da tela */
          const cardLeft = pin.x > 55;
          return (
            <div
              key={pin.id}
              className={`${styles.pin} ${isActive ? styles.pinActive : ''}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onMouseEnter={() => setHoveredPin(pin.id)}
              onMouseLeave={() => setHoveredPin(null)}
              onClick={() => setActivePin(isActive ? null : pin.id)}
            >
              {/* Card fixo 46x46 + tooltip absolutamente posicionado ao lado */}
              <div className={styles.pinCardArea}>
                <div className={styles.pinCard}>
                  <Icon cat={pin.cat} size={30} />
                </div>
                <div className={`${styles.tooltip} ${isOpen ? styles.tooltipOpen : ''} ${cardLeft ? styles.tooltipLeft : styles.tooltipRight}`}>
                  <span className={styles.tooltipName}>{pin.name}</span>
                  <span className={styles.tooltipTime}><CarIcon /> {pin.car}</span>
                </div>
              </div>
              <div className={styles.pinLine} />
              <div className={styles.pinDot} />
            </div>
          );
        })}
      </div>

      {/* ── Barra inferior ──────────────────────────────────────────────────── */}
      <div className={styles.bottomBar}>
        {/* Logo cell */}
        <div className={styles.bottomLogo}>
          <span className={styles.bottomLogoText}>VĒRTICE</span>
        </div>
        {/* Pins grid */}
        <div className={styles.bottomGrid}>
          {PINS.map(pin => (
            <button
              key={pin.id}
              className={`${styles.bottomCell} ${activePin === pin.id || hoveredPin === pin.id ? styles.bottomCellActive : ''}`}
              onClick={() => setActivePin(pin.id === activePin ? null : pin.id)}
            >
              {pin.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
