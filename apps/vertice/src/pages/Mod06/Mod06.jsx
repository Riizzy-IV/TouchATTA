import { useState, useEffect, useCallback } from 'react';
import { useTransition } from '@showcase/core';
import styles from './Mod06.module.css';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1SMHsZej3XaqIjlNwq-nzLhWCaeTzhXGoTJ7P8B2_GOI/export?format=csv&gid=582955310';

function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const char of row) {
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function getPlantImg(id) {
  if (id <= 5)  return `/Planta Vertice/UNIDADE ${id}_INFERIOR.avif`;
  if (id <= 19) return `/Planta Vertice/UNIDADE ${id}.avif`;
  if (id <= 29) return `/Planta Vertice/UNIDADE ${id - 10}.avif`;
  if (id <= 35) return `/Planta Vertice/UNIDADE ${id}.avif`;
  return `/Planta Vertice/UNIDADE FINAL ${id % 10}.avif`;
}

function floorShort(label) {
  if (!label) return '';
  if (label.toLowerCase().includes('térreo')) return 'TÉR.';
  return label.replace(/\s*Pavimento\s*/i, '').trim();
}

export default function Mod06() {
  const { closeModule } = useTransition();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dispCount, setDispCount] = useState(0);

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(text => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        const floorMap = {};
        const floorOrder = [];
        let currentFloor = null;

        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVRow(lines[i]);
          const col0 = (cols[0] || '').trim();
          const isUnit = /^\d+$/.test(col0);

          if (!isUnit) {
            if (!col0) continue;
            currentFloor = col0;
            if (!floorMap[currentFloor]) {
              floorMap[currentFloor] = [];
              floorOrder.push(currentFloor);
            }
            continue;
          }

          if (!currentFloor) continue;
          const id = parseInt(col0, 10);

          floorMap[currentFloor].push({
            id,
            tipologia: cols[1] || '',
            total:     cols[6] || cols[3] || '',
            valor:     cols[7] || '',
            status:    (cols[9] || 'Vendido').trim(),
            img:       getPlantImg(id),
          });
        }

        const orderedFloors = [...floorOrder].reverse().map(label => ({
          label,
          units: floorMap[label],
        }));

        const count = Object.values(floorMap).flat().filter(u => u.status === 'Disponível').length;
        setFloors(orderedFloors);
        setDispCount(count);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <div className={styles.scene}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/img/logo.png" alt="Vértice" className={styles.headerLogo} />
          <span className={styles.badge}>disponibilidade</span>
        </div>

        <div className={styles.headerCenter}>
          {!loading && (
            <div className={styles.counter}>
              <span className={styles.counterNum}>{dispCount}</span>
              <span className={styles.counterSep}>/</span>
              <span className={styles.counterTotal}>71 unidades</span>
              <span className={styles.counterLabel}>disponíveis</span>
            </div>
          )}
        </div>

        <div className={styles.headerRight}>
          <div className={styles.legend}>
            <span className={`${styles.dot} ${styles.dotDisp}`} />
            <span className={styles.legendText}>Disponível</span>
            <span className={`${styles.dot} ${styles.dotVend}`} />
            <span className={styles.legendText}>Vendido</span>
          </div>
          <button className={styles.closeBtn} onClick={closeModule}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Grid ── */}
      <div className={styles.gridArea}>
        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>carregando disponibilidade…</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {floors.map(floor => (
              <div key={floor.label} className={styles.floorRow}>
                <div className={styles.floorLabel}>{floorShort(floor.label)}</div>
                <div className={styles.unitRow}>
                  {floor.units.map(unit => {
                    const isDisp = unit.status === 'Disponível';
                    return (
                      <button
                        key={unit.id}
                        className={`${styles.cell} ${isDisp ? styles.cellDisp : styles.cellVend}`}
                        onClick={() => setSelected(unit)}
                      >
                        <span className={styles.cellNum}>{unit.id}</span>
                        {unit.total && <span className={styles.cellArea}>{unit.total}m²</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={`${styles.modalBadge} ${selected.status === 'Disponível' ? styles.badgeDisp : styles.badgeVend}`}>
              {selected.status}
            </div>

            <img src={selected.img} alt={`Unidade ${selected.id}`} className={styles.modalPlant} />

            <div className={styles.modalInfo}>
              <p className={styles.modalUnit}>Unidade {selected.id}</p>
              <p className={styles.modalTipo}>{selected.tipologia}</p>
              {selected.total && <p className={styles.modalArea}>{selected.total} m² totais</p>}
              {selected.status === 'Disponível' && selected.valor && (
                <p className={styles.modalValor}>{selected.valor}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
