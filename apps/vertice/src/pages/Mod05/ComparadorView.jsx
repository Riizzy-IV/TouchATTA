import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ComparadorView.module.css';

const GROUPS = [
  {
    label: 'TÉRREO',
    units: [
      { id: 'u1',  name: 'UNIDADE 1',  area: '32,58 m²', img: '/Planta Vertice/UNIDADE 1_INFERIOR.avif' },
      { id: 'u2',  name: 'UNIDADE 2',  area: '26,71 m²', img: '/Planta Vertice/UNIDADE 2_INFERIOR.avif' },
      { id: 'u3',  name: 'UNIDADE 3',  area: '29,46 m²', img: '/Planta Vertice/UNIDADE 3_INFERIOR.avif' },
      { id: 'u4',  name: 'UNIDADE 4',  area: '39,05 m²', img: '/Planta Vertice/UNIDADE 4_INFERIOR.avif' },
      { id: 'u5',  name: 'UNIDADE 5',  area: '36,33 m²', img: '/Planta Vertice/UNIDADE 5_INFERIOR.avif' },
    ],
  },
  {
    label: '1º E 2º PAV.',
    units: [
      { id: 'u11', name: 'UND. 11/21', area: '24,17 m²', img: '/Planta Vertice/UNIDADE 11.avif' },
      { id: 'u12', name: 'UND. 12/22', area: '24,20 m²', img: '/Planta Vertice/UNIDADE 12.avif' },
      { id: 'u13', name: 'UND. 13/23', area: '24,91 m²', img: '/Planta Vertice/UNIDADE 13.avif' },
      { id: 'u14', name: 'UND. 14/24', area: '30,35 m²', img: '/Planta Vertice/UNIDADE 14.avif' },
      { id: 'u15', name: 'UND. 15/25', area: '29,31 m²', img: '/Planta Vertice/UNIDADE 15.avif' },
      { id: 'u16', name: 'UND. 16/26', area: '31,15 m²', img: '/Planta Vertice/UNIDADE 16.avif' },
      { id: 'u17', name: 'UND. 17/27', area: '29,10 m²', img: '/Planta Vertice/UNIDADE 17.avif' },
      { id: 'u18', name: 'UND. 18/28', area: '28,85 m²', img: '/Planta Vertice/UNIDADE 18.avif' },
      { id: 'u19', name: 'UND. 19/29', area: '27,50 m²', img: '/Planta Vertice/UNIDADE 19.avif' },
    ],
  },
  {
    label: '3º PAV.',
    units: [
      { id: 'u33', name: 'UNIDADE 33', area: '33,37 m²', img: '/Planta Vertice/UNIDADE 33.avif' },
      { id: 'u34', name: 'UNIDADE 34', area: '33,52 m²', img: '/Planta Vertice/UNIDADE 34.avif' },
      { id: 'u35', name: 'UNIDADE 35', area: '54,42 m²', img: '/Planta Vertice/UNIDADE 35.avif' },
    ],
  },
  {
    label: '4º AO 12º PAV.',
    units: [
      { id: 'uf1', name: 'FINAL 1', area: '35,57 m²', img: '/Planta Vertice/UNIDADE FINAL 1.avif' },
      { id: 'uf2', name: 'FINAL 2', area: '36,10 m²', img: '/Planta Vertice/UNIDADE FINAL 2.avif' },
      { id: 'uf3', name: 'FINAL 3', area: '24,72 m²', img: '/Planta Vertice/UNIDADE FINAL 3.avif' },
      { id: 'uf4', name: 'FINAL 4', area: '26,58 m²', img: '/Planta Vertice/UNIDADE FINAL 4.avif' },
      { id: 'uf5', name: 'FINAL 5', area: '28,14 m²', img: '/Planta Vertice/UNIDADE FINAL 5.avif' },
    ],
  },
];

const ALL_UNITS   = GROUPS.flatMap(g => g.units);
const CARD_W      = 240;
const CARD_H_EST  = 200; // estimated card height for centering ghost
const clamp       = (v, min, max) => Math.max(min, Math.min(max, v));
const pinchDist   = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

export default function ComparadorView() {
  const canvasRef   = useRef(null);
  const [active, setActive] = useState([]); // [{id, x, y, scale}]
  const activeRef   = useRef([]);
  const cardRefs    = useRef({});
  const dragRef     = useRef(null);   // canvas card drag
  const pinchRef    = useRef(null);   // pinch
  const dockDragRef = useRef(null);   // dock → canvas drag
  const lastTapRef  = useRef({});
  const [ghost, setGhost] = useState(null); // {unit, x, y} viewport coords

  useEffect(() => { activeRef.current = active; }, [active]);

  /* ── wheel resize ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const cleanups = [];
    for (const [id, card] of Object.entries(cardRefs.current)) {
      if (!card) continue;
      const handler = (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        setActive(prev => prev.map(a =>
          a.id === id ? { ...a, scale: clamp(a.scale * factor, 0.25, 3) } : a
        ));
      };
      card.addEventListener('wheel', handler, { passive: false });
      cleanups.push(() => card.removeEventListener('wheel', handler));
    }
    return () => cleanups.forEach(fn => fn());
  }, [active]);

  /* ── global mouse + touch ──────────────────────────────────────────────── */
  useEffect(() => {
    const getXY = (e) => e.touches
      ? { x: e.touches[0].clientX,        y: e.touches[0].clientY }
      : { x: e.clientX,                    y: e.clientY };
    const getUpXY = (e) => e.changedTouches
      ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
      : { x: e.clientX,                    y: e.clientY };

    const onMove = (e) => {
      const { x, y } = getXY(e);

      /* dock drag ghost */
      if (dockDragRef.current) {
        const { startX, startY } = dockDragRef.current;
        if (Math.abs(x - startX) > 6 || Math.abs(y - startY) > 6) {
          dockDragRef.current.moved = true;
        }
        setGhost(g => g ? { ...g, x, y } : g);
        return;
      }

      /* pinch */
      if (pinchRef.current && e.touches && e.touches.length === 2) {
        const { id, initialDist, initialScale } = pinchRef.current;
        const newScale = clamp(initialScale * (pinchDist(e.touches) / initialDist), 0.25, 3);
        pinchRef.current.currentScale = newScale;
        const card = cardRefs.current[id];
        if (card) card.style.transform = `scale(${newScale})`;
        return;
      }

      /* canvas card drag */
      if (!dragRef.current) return;
      const { id, startX, startY, origX, origY } = dragRef.current;
      const dx = x - startX;
      const dy = y - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true;
      const card = cardRefs.current[id];
      if (card) { card.style.left = `${origX + dx}px`; card.style.top = `${origY + dy}px`; }
    };

    const onUp = (e) => {
      const { x, y } = getUpXY(e);

      /* dock drag drop */
      if (dockDragRef.current) {
        const { unit, moved } = dockDragRef.current;
        dockDragRef.current = null;
        setGhost(null);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const inCanvas = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        const cur = activeRef.current;
        const alreadyActive = cur.find(a => a.id === unit.id);

        if (alreadyActive) return;

        if (moved && inCanvas) {
          // drop at pointer position, centered
          const relX = x - rect.left - CARD_W / 2;
          const relY = y - rect.top  - CARD_H_EST / 2;
          setActive(prev => [...prev, {
            id: unit.id,
            x: clamp(relX, 0, rect.width  - CARD_W),
            y: clamp(relY, 0, rect.height - CARD_H_EST),
            scale: 1,
          }]);
        }
        return;
      }

      /* pinch end */
      if (pinchRef.current) {
        const { id, currentScale } = pinchRef.current;
        pinchRef.current = null;
        if (currentScale !== undefined)
          setActive(prev => prev.map(a => a.id === id ? { ...a, scale: currentScale } : a));
        return;
      }

      /* canvas card drag end */
      if (!dragRef.current) return;
      const { id, startX, startY, origX, origY, moved } = dragRef.current;
      dragRef.current = null;
      const dx = x - startX;
      const dy = y - startY;
      const card = cardRefs.current[id];
      if (card) { card.style.cursor = 'grab'; card.style.zIndex = ''; }

      if (!moved) {
        const now = Date.now();
        if (now - (lastTapRef.current[id] || 0) < 400)
          setActive(prev => prev.filter(a => a.id !== id));
        lastTapRef.current[id] = now;
        return;
      }
      setActive(prev => prev.map(a => a.id === id ? { ...a, x: origX + dx, y: origY + dy } : a));
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onUp);
    };
  }, []);

  /* ── dock card press ───────────────────────────────────────────────────── */
  const onDockDown = useCallback((e, unit) => {
    if (activeRef.current.find(a => a.id === unit.id)) return;
    if (activeRef.current.length >= 6) return;
    e.preventDefault();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    dockDragRef.current = { unit, startX: x, startY: y, moved: false };
    setGhost({ unit, x, y });
  }, []);

  /* ── canvas card press (mouse) ─────────────────────────────────────────── */
  const onCardMouseDown = useCallback((e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const item = activeRef.current.find(a => a.id === id);
    if (!item) return;
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, origX: item.x, origY: item.y, moved: false };
    const card = cardRefs.current[id];
    if (card) { card.style.cursor = 'grabbing'; card.style.zIndex = '100'; }
  }, []);

  /* ── canvas card press (touch) ─────────────────────────────────────────── */
  const onCardTouchStart = useCallback((e, id) => {
    e.stopPropagation();
    const item = activeRef.current.find(a => a.id === id);
    if (!item) return;
    if (e.touches.length >= 2) {
      dragRef.current = null;
      pinchRef.current = { id, initialDist: pinchDist(e.touches), initialScale: item.scale };
    } else {
      pinchRef.current = null;
      dragRef.current = {
        id, startX: e.touches[0].clientX, startY: e.touches[0].clientY,
        origX: item.x, origY: item.y, moved: false,
      };
      const card = cardRefs.current[id];
      if (card) card.style.zIndex = '100';
    }
  }, []);

  const activeIds = new Set(active.map(a => a.id));

  return (
    <div className={styles.root}>
      {/* Canvas */}
      <div className={styles.canvas} ref={canvasRef}>

        <div className={styles.instructions}>
          {/* Mover */}
          <div className={styles.instrItem}>
            <svg className={styles.instrIcon} viewBox="0 0 40 40" fill="none">
              <path d="M20 6L20 34M6 20L34 20" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M20 6L17 11M20 6L23 11" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 34L17 29M20 34L23 29" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 20L11 17M6 20L11 23" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M34 20L29 17M34 20L29 23" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.instrText}>ARRASTE PARA MOVER</span>
          </div>
          {/* Redimensionar */}
          <div className={styles.instrItem}>
            <svg className={styles.instrIcon} viewBox="0 0 40 40" fill="none">
              <path d="M8 8L16 8M8 8L8 16" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 8L24 8M32 8L32 16" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 32L16 32M8 32L8 24" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 32L24 32M32 32L32 24" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="20" r="4" stroke="rgba(42,154,170,0.7)" strokeWidth="1.5"/>
            </svg>
            <span className={styles.instrText}>PINÇA OU SCROLL PARA REDIMENSIONAR</span>
          </div>
          {/* Remover — hand tap icon */}
          <div className={styles.instrItem}>
            <svg className={styles.instrIcon} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="2.5" stroke="rgba(42,154,170,0.6)" strokeWidth="1"/>
              <circle cx="12" cy="7" r="4.5" stroke="rgba(42,154,170,0.3)" strokeWidth="0.8"/>
              <path d="M8.5 12.5 L8.5 8 C8.5 7.2 9.2 6.5 10 6.5 C10.8 6.5 11.5 7.2 11.5 8 L11.5 11 C11.8 10.7 12.3 10.5 12.8 10.5 C13.4 10.5 13.9 10.9 14 11.4 C14.3 11.1 14.7 11 15.1 11.1 C15.6 11.3 15.8 11.7 15.9 12.1 C16.2 11.9 16.6 11.9 17 12.2 C17.4 12.5 17.5 13 17.5 13.5 L17.5 16 C17.5 18 16 19.5 14 19.5 L12 19.5 C10.5 19.5 9.2 18.6 8.7 17.3 L7.3 14.3 C7 13.6 7.4 12.8 8.1 12.6 L8.5 12.5Z"
                stroke="rgba(42,154,170,0.8)" strokeWidth="1.1" strokeLinejoin="round"/>
            </svg>
            <span className={styles.instrText}>TOQUE 2X PARA REMOVER</span>
          </div>
        </div>

        {active.length === 0 && (
          <div className={styles.emptyHint}>
            Arraste plantas do painel abaixo<br />para comparar
          </div>
        )}

        {/* Canvas cards */}
        {active.map(({ id, x, y, scale }) => {
          const unit = ALL_UNITS.find(u => u.id === id);
          if (!unit) return null;
          return (
            <div
              key={id}
              ref={el => { cardRefs.current[id] = el; }}
              className={styles.canvasCard}
              style={{ left: x, top: y, transform: `scale(${scale})`, transformOrigin: '0 0' }}
              onMouseDown={e => onCardMouseDown(e, id)}
              onTouchStart={e => onCardTouchStart(e, id)}
            >
              <img src={unit.img} alt={unit.name} className={styles.canvasCardImg} draggable={false} />
              <div className={styles.canvasCardLabel}>
                <span className={styles.canvasCardName}>{unit.name}</span>
                <span className={styles.canvasCardArea}>{unit.area}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ghost card while dragging from dock */}
      {ghost && (
        <div
          className={styles.ghostCard}
          style={{ left: ghost.x - CARD_W / 2, top: ghost.y - CARD_H_EST / 2 }}
        >
          <img src={ghost.unit.img} alt={ghost.unit.name} className={styles.canvasCardImg} draggable={false} />
          <div className={styles.canvasCardLabel}>
            <span className={styles.canvasCardName}>{ghost.unit.name}</span>
            <span className={styles.canvasCardArea}>{ghost.unit.area}</span>
          </div>
        </div>
      )}

      {/* Dock */}
      <div className={styles.dock}>
        <div className={styles.dockScroll}>
          {GROUPS.map((group, gi) => (
            <div key={gi} className={styles.dockGroup}>
              {gi > 0 && <div className={styles.separator} />}
              <span className={styles.dockGroupLabel}>{group.label}</span>
              {group.units.map(unit => {
                const isActive = activeIds.has(unit.id);
                return (
                  <div
                    key={unit.id}
                    className={`${styles.dockCard} ${isActive ? styles.dockCardActive : ''}`}
                    onMouseDown={e => !isActive && onDockDown(e, unit)}
                    onTouchStart={e => !isActive && onDockDown(e, unit)}
                  >
                    <img src={unit.img} alt={unit.name} className={styles.dockCardImg} draggable={false} />
                    <div className={styles.dockCardInfo}>
                      <span className={styles.dockCardName}>{unit.name}</span>
                      <span className={styles.dockCardArea}>{unit.area}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
