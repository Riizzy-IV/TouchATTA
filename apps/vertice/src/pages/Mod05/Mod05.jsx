import { useState, useCallback, useRef } from 'react';
import ModuleLayout from '../../components/ModuleLayout/ModuleLayout';
import styles from './Mod05.module.css';
import ComparadorView from './ComparadorView';

const TABS = ['TIPOLOGIA', 'PLANTAS', 'COMPARADOR'];

const UNITS = [
  {
    id: 'A',
    type: 'STUDIO',
    area: '22 – 25',
    floor: '1º ao 8º pavimento',
    rooms: [
      { label: 'Living integrado', value: '~14 m²' },
      { label: 'Banheiro', value: '~4 m²' },
      { label: 'Varanda', value: 'Optional' },
    ],
    tag: 'COMPACTO',
    color: '#0d3a48',
  },
  {
    id: 'B',
    type: 'STUDIO PLUS',
    area: '28 – 32',
    floor: '9º ao 16º pavimento',
    rooms: [
      { label: 'Living integrado', value: '~18 m²' },
      { label: 'Banheiro', value: '~5 m²' },
      { label: 'Varanda', value: '~4 m²' },
    ],
    tag: 'MID FLOOR',
    color: '#0f4455',
  },
  {
    id: 'C',
    type: '1 DORMITÓRIO',
    area: '36 – 42',
    floor: '17º ao 22º pavimento',
    rooms: [
      { label: 'Suíte', value: '~13 m²' },
      { label: 'Living integrado', value: '~16 m²' },
      { label: 'Varanda', value: '~6 m²' },
    ],
    tag: 'HIGH FLOOR',
    color: '#134858',
  },
];

function TipologiaView() {
  return (
    <div className={styles.layout}>
      <div className={styles.infoPanel}>
        <h2 className={styles.sectionTitle}>UNIDADES</h2>
        <p className={styles.sectionDesc}>
          Três tipologias pensadas para diferentes estilos de vida — do studio
          compacto ao 1 dormitório com varanda — todos com acabamento refinado
          e gestão Housi integrada.
        </p>
        <ul className={styles.highlights}>
          <li>Studios de 22 a 25 m²</li>
          <li>Studios Plus de 28 a 32 m²</li>
          <li>1 Dorm. de 36 a 42 m²</li>
          <li>Alto acabamento padrão A</li>
          <li>Gestão Housi incluída</li>
        </ul>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.unitsGrid}>
          {UNITS.map((unit) => (
            <div key={unit.id} className={styles.unitCard} style={{ '--card-color': unit.color }}>
              <div className={styles.unitHeader}>
                <span className={styles.unitTag}>{unit.tag}</span>
                <span className={styles.unitId}>{unit.id}</span>
              </div>

              <div className={styles.unitType}>{unit.type}</div>

              <div className={styles.unitArea}>
                <span className={styles.areaNumber}>{unit.area}</span>
                <span className={styles.areaSuffix}>m²</span>
              </div>

              <div className={styles.unitFloor}>{unit.floor}</div>

              <div className={styles.unitDivider} />

              <ul className={styles.unitRooms}>
                {unit.rooms.map((room, i) => (
                  <li key={i} className={styles.unitRoom}>
                    <span className={styles.roomLabel}>{room.label}</span>
                    <span className={styles.roomValue}>{room.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PLANTAS = [
  { src: '/img/plantas/planta-01.jpg', caption: 'planta · página 1' },
  { src: '/img/plantas/planta-02.jpg', caption: 'planta · página 2' },
  { src: '/img/plantas/planta-03.jpg', caption: 'planta · página 3' },
  { src: '/img/plantas/planta-04.jpg', caption: 'planta · página 4' },
  { src: '/img/plantas/planta-05.jpg', caption: 'planta · página 5' },
];

function PlantasView() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading]   = useState(false);

  const goTo = useCallback((i) => {
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 180);
  }, []);

  const prev = useCallback(() => goTo((current - 1 + PLANTAS.length) % PLANTAS.length), [current, goTo]);
  const next = useCallback(() => goTo((current + 1) % PLANTAS.length), [current, goTo]);

  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
  }, [next, prev]);

  const slide = PLANTAS[current];

  return (
    <div className={styles.plantasWrapper} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <button className={`${styles.plantasArrow} ${styles.plantasArrowLeft}`} onClick={prev} aria-label="Anterior">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className={`${styles.plantasImgWrap} ${fading ? styles.plantasFading : ''}`}>
        <img src={slide.src} alt={slide.caption} className={styles.plantasImg} draggable={false} />
        <div className={styles.plantasCaption}>{slide.caption}</div>
      </div>

      <button className={`${styles.plantasArrow} ${styles.plantasArrowRight}`} onClick={next} aria-label="Próximo">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className={styles.plantasDots}>
        {PLANTAS.map((_, i) => (
          <button
            key={i}
            className={`${styles.plantasDot} ${i === current ? styles.plantasDotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Planta ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Mod05() {
  return (
    <ModuleLayout tabs={TABS} defaultTab="TIPOLOGIA">
      {(activeTab) =>
        activeTab === 'TIPOLOGIA'  ? <TipologiaView />
        : activeTab === 'PLANTAS'   ? <PlantasView />
        : <ComparadorView />
      }
    </ModuleLayout>
  );
}
