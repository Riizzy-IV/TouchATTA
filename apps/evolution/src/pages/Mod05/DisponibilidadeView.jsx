import { useState, useCallback, useEffect } from 'react';
import styles from './DisponibilidadeView.module.css';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/135-_tdZfTAqwZBjIq1sEw9H_8UYGPVfBC9strqaYcrY/export?format=csv&gid=582955310';

const PLANT_SRC = {
  'unidade-11':               '/img/plantas-humanizadas/unidade-11.webp',
  'unidades-12-17':           '/img/plantas-humanizadas/unidades-12-17.webp',
  'unidade-18':                '/img/plantas-humanizadas/unidade-18.webp',
  'unidades-21-31':           '/img/plantas-humanizadas/unidades-21-31.webp',
  'unidades-22-27-32-37':     '/img/plantas-humanizadas/unidades-22-27-32-37.webp',
  'unidades-28-38':           '/img/plantas-humanizadas/unidades-28-38.webp',
  'unidade-41':                '/img/plantas-humanizadas/unidade-41.webp',
  'unidades-51-61-71-81-91':  '/img/plantas-humanizadas/unidades-51-61-71-81-91.webp',
  'unidades-52-62-72-82-92':  '/img/plantas-humanizadas/unidades-52-62-72-82-92.webp',
  'unidades-53-63-73-83-93':  '/img/plantas-humanizadas/unidades-53-63-73-83-93.webp',
};

function getPlantImg(id) {
  if (id === 11) return PLANT_SRC['unidade-11'];
  if (id >= 12 && id <= 17) return PLANT_SRC['unidades-12-17'];
  if (id === 18) return PLANT_SRC['unidade-18'];
  if (id === 41) return PLANT_SRC['unidade-41'];
  if (id >= 21 && id <= 38) {
    const last = id % 10;
    if (last === 1) return PLANT_SRC['unidades-21-31'];
    if (last === 8) return PLANT_SRC['unidades-28-38'];
    return PLANT_SRC['unidades-22-27-32-37'];
  }
  if (id >= 51 && id <= 93) {
    const last = id % 10;
    if (last === 1) return PLANT_SRC['unidades-51-61-71-81-91'];
    if (last === 2) return PLANT_SRC['unidades-52-62-72-82-92'];
    if (last === 3) return PLANT_SRC['unidades-53-63-73-83-93'];
  }
  return null;
}

function parseCSVRow(row) {
  const result = []; let cur = ''; let inQ = false;
  for (const c of row) {
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { result.push(cur.trim()); cur = ''; }
    else { cur += c; }
  }
  result.push(cur.trim());
  return result;
}

function floorShort(label) {
  if (!label) return '';
  if (label.toLowerCase().includes('térreo')) return 'TÉR.';
  return label.replace(/\s*Pavimento\s*/i, '').trim();
}

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function DisponibilidadeView() {
  const [floors, setFloors]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dispCount, setDispCount] = useState(0);
  const [total, setTotal]       = useState(0);

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(text => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        const floorMap = {}, floorOrder = [];
        let currentFloor = null;
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVRow(lines[i]);
          const col0 = (cols[0] || '').trim();
          if (!/^\d+$/.test(col0)) {
            if (!col0) continue;
            currentFloor = col0;
            if (!floorMap[currentFloor]) { floorMap[currentFloor] = []; floorOrder.push(currentFloor); }
            continue;
          }
          if (!currentFloor) continue;
          const id = parseInt(col0, 10);
          floorMap[currentFloor].push({
            id,
            tipologia: cols[1] || '',
            total: cols[3] || '',
            valor: cols[4] || '',
            status: (cols[5] || 'Vendido').trim(),
            img: getPlantImg(id),
          });
        }
        const ordered = [...floorOrder].reverse().map(l => ({ label: l, units: floorMap[l] }));
        const allUnits = Object.values(floorMap).flat();
        setDispCount(allUnits.filter(u => u.status === 'Disponível').length);
        setTotal(allUnits.length);
        setFloors(ordered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <div className={styles.dispScene}>
      <div className={styles.dispTopBar}>
        {!loading && (
          <div className={styles.dispCounter}>
            <span className={styles.dispCounterNum}>{dispCount}</span>
            <span className={styles.dispCounterOf}> / {total}</span>
            <span className={styles.dispCounterLabel}> disponíveis</span>
          </div>
        )}
        <div className={styles.dispLegend}>
          <span className={`${styles.dispDot} ${styles.dispDotDisp}`} /><span className={styles.dispLegendTxt}>Disponível</span>
          <span className={`${styles.dispDot} ${styles.dispDotVend}`} /><span className={styles.dispLegendTxt}>Vendido</span>
        </div>
      </div>

      <div className={styles.dispGridArea}>
        {loading ? (
          <div className={styles.dispLoading}>
            <div className={styles.dispSpinner} />
            <p className={styles.dispLoadingTxt}>carregando disponibilidade…</p>
          </div>
        ) : (
          <div className={styles.dispGrid}>
            {floors.map(floor => (
              <div key={floor.label} className={styles.dispFloorRow}>
                <div className={styles.dispFloorLabel}>{floorShort(floor.label)}</div>
                <div className={styles.dispUnitRow}>
                  {floor.units.map(unit => {
                    const isDisp = unit.status === 'Disponível';
                    return (
                      <button
                        key={unit.id}
                        className={`${styles.dispCell} ${isDisp ? styles.dispCellDisp : styles.dispCellVend}`}
                        onClick={() => setSelected(unit)}
                      >
                        <span className={`${styles.dispCellNum} ${isDisp ? styles.dispCellNumDisp : styles.dispCellNumVend}`}>{unit.id}</span>
                        {unit.total && <span className={`${styles.dispCellArea} ${isDisp ? styles.dispCellAreaDisp : styles.dispCellAreaVend}`}>{unit.total}m²</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className={styles.dispOverlay} onClick={closeModal}>
          <div className={styles.dispModal} onClick={e => e.stopPropagation()}>
            <button className={styles.dispModalClose} onClick={closeModal}><IconClose /></button>
            <div className={`${styles.dispModalBadge} ${selected.status === 'Disponível' ? styles.dispBadgeDisp : styles.dispBadgeVend}`}>
              {selected.status}
            </div>
            {selected.img && <img src={selected.img} alt={`Unidade ${selected.id}`} className={styles.dispModalPlant} />}
            <div className={styles.dispModalInfo}>
              <p className={styles.dispModalUnit}>Unidade {selected.id}</p>
              <p className={styles.dispModalTipo}>{selected.tipologia}</p>
              {selected.total && <p className={styles.dispModalArea}>{selected.total} m² totais</p>}
              {selected.status === 'Disponível' && selected.valor && (
                <p className={styles.dispModalValor}>{selected.valor}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
