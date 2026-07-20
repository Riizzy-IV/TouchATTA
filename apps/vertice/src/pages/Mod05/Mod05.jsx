import { useState, useCallback, useRef } from 'react';
import ModuleLayout from '../../components/ModuleLayout/ModuleLayout';
import styles from './Mod05.module.css';
import ComparadorView from './ComparadorView';

const TABS = ['PLANTAS', 'COMPARADOR'];

const UNITS = [
  {
    id: 'A',
    type: 'STUDIO',
    area: '24 – 29',
    floor: '1º ao 12º pavimento',
    rooms: [
      { label: 'Living integrado', value: '~16 m²' },
      { label: 'Banheiro', value: '~4 m²' },
    ],
    tag: 'COMPACTO',
    color: '#0d3a48',
  },
  {
    id: 'B',
    type: '1 DORMITÓRIO',
    area: '30 – 36',
    floor: '1º ao 12º pavimento',
    rooms: [
      { label: 'Dormitório', value: '~13 m²' },
      { label: 'Living integrado', value: '~16 m²' },
      { label: 'Banheiro', value: '~5 m²' },
    ],
    tag: 'STANDARD',
    color: '#0f4455',
  },
  {
    id: 'C',
    type: 'GARDEN',
    area: '27 – 54',
    floor: 'Térreo e 3º pavimento',
    rooms: [
      { label: 'Living integrado', value: '~20 m²' },
      { label: 'Banheiro', value: '~5 m²' },
      { label: 'Área descoberta', value: 'inclusa' },
    ],
    tag: 'ESPECIAL',
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
          compacto ao garden especial — distribuídas entre o Térreo e o 12º
          pavimento.
        </p>
        <ul className={styles.highlights}>
          <li>Studios de 24 a 29 m²</li>
          <li>1 Dormitório de 30 a 36 m²</li>
          <li>Garden de 27 a 54 m²</li>
          <li>Térreo ao 12º pavimento</li>
          <li>71 unidades no total</li>
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
  { src: '/img/plantas/planta-01.jpg', caption: 'Unidade 1 · Térreo' },
  { src: '/img/plantas/planta-02.jpg', caption: 'Unidade 2 · Térreo' },
  { src: '/img/plantas/planta-03.jpg', caption: 'Unidade 3 · Térreo' },
  { src: '/img/plantas/planta-04.jpg', caption: 'Unidade 4 · Térreo' },
  { src: '/img/plantas/planta-05.jpg', caption: 'Unidade 5 · Térreo' },
  { src: '/img/plantas/planta-06.jpg', caption: 'Unidades 11/21 e 12/22 · Tipo 2' },
  { src: '/img/plantas/planta-07.jpg', caption: 'Unidades 13/23 e 14/24 · Tipo 2' },
  { src: '/img/plantas/planta-08.jpg', caption: 'Unidades 15/25 e 16/26 · Tipo 2' },
  { src: '/img/plantas/planta-09.jpg', caption: 'Unidades 17/27 e 18/28 · Tipo 2' },
  { src: '/img/plantas/planta-10.jpg', caption: 'Unidade 19/29 e 33 · Tipo 2/3' },
  { src: '/img/plantas/planta-11.jpg', caption: 'Unidades 34 e 35 · Tipo 3' },
  { src: '/img/plantas/planta-12.jpg', caption: 'Final 1 e Final 2 · Tipo 4' },
  { src: '/img/plantas/planta-13.jpg', caption: 'Final 3 e Final 4 · Tipo 4' },
  { src: '/img/plantas/planta-14.jpg', caption: 'Final 5 · Tipo 4' },
];

const PLANT_UNITS = [
  { group: 'TÉRREO',  label: 'Unidade 1',   area: '32,58', slide: 0 },
  { group: 'TÉRREO',  label: 'Unidade 2',   area: '26,71', slide: 1 },
  { group: 'TÉRREO',  label: 'Unidade 3',   area: '29,46', slide: 2 },
  { group: 'TÉRREO',  label: 'Unidade 4',   area: '39,05', slide: 3 },
  { group: 'TÉRREO',  label: 'Unidade 5',   area: '36,33', slide: 4 },
  { group: 'TIPO 2',  label: 'Unid. 11/21', area: '24,17', slide: 5 },
  { group: 'TIPO 2',  label: 'Unid. 12/22', area: '24,20', slide: 5 },
  { group: 'TIPO 2',  label: 'Unid. 13/23', area: '24,91', slide: 6 },
  { group: 'TIPO 2',  label: 'Unid. 14/24', area: '30,35', slide: 6 },
  { group: 'TIPO 2',  label: 'Unid. 15/25', area: '29,31', slide: 7 },
  { group: 'TIPO 2',  label: 'Unid. 16/26', area: '31,15', slide: 7 },
  { group: 'TIPO 2',  label: 'Unid. 17/27', area: '29,10', slide: 8 },
  { group: 'TIPO 2',  label: 'Unid. 18/28', area: '28,85', slide: 8 },
  { group: 'TIPO 2',  label: 'Unid. 19/29', area: '27,50', slide: 9 },
  { group: 'TIPO 3',  label: 'Unidade 33',  area: '33,37', slide: 9 },
  { group: 'TIPO 3',  label: 'Unidade 34',  area: '33,52', slide: 10 },
  { group: 'TIPO 3',  label: 'Unidade 35',  area: '54,42', slide: 10 },
  { group: 'TIPO 4',  label: 'Final 1',     area: '35,57', slide: 11 },
  { group: 'TIPO 4',  label: 'Final 2',     area: '36,10', slide: 11 },
  { group: 'TIPO 4',  label: 'Final 3',     area: '24,72', slide: 12 },
  { group: 'TIPO 4',  label: 'Final 4',     area: '26,58', slide: 12 },
  { group: 'TIPO 4',  label: 'Final 5',     area: '28,14', slide: 13 },
];

const PLANT_GROUPS = ['TÉRREO', 'TIPO 2', 'TIPO 3', 'TIPO 4'];

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
    <div className={styles.plantasWrapper}>
      {/* Sidebar com botões de metragem */}
      <div className={styles.plantasSidebar}>
        {PLANT_GROUPS.map((group) => (
          <div key={group} className={styles.sidebarGroup}>
            <div className={styles.sidebarGroupLabel}>{group}</div>
            {PLANT_UNITS.filter((u) => u.group === group).map((unit, i) => (
              <button
                key={i}
                className={`${styles.sidebarBtn} ${unit.slide === current ? styles.sidebarBtnActive : ''}`}
                onClick={() => goTo(unit.slide)}
              >
                <span className={styles.sidebarBtnArea}>{unit.area}</span>
                <span className={styles.sidebarBtnSuffix}>m²</span>
                <span className={styles.sidebarBtnLabel}>{unit.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Área da imagem */}
      <div
        className={styles.plantasImgArea}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
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
      </div>
    </div>
  );
}

export default function Mod05() {
  return (
    <ModuleLayout tabs={TABS} defaultTab="PLANTAS">
      {(activeTab) =>
        activeTab === 'PLANTAS' ? <PlantasView />
        : <ComparadorView />
      }
    </ModuleLayout>
  );
}
