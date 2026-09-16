import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './ZoomableImage.module.css';

const MIN_SCALE = 1;
const MAX_SCALE = 5;

const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconMinus = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconReset = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default function ZoomableImage({ src, alt = '' }) {
  const wrapRef = useRef(null);
  const stateRef = useRef({ scale: 1, x: 0, y: 0 });
  const [, force] = useState(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const applyTransform = useCallback(() => {
    const el = wrapRef.current?.querySelector('img');
    if (!el) return;
    const { scale, x, y } = stateRef.current;
    el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  const clamp = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { scale } = stateRef.current;
    const rect = wrap.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;
    stateRef.current.x = Math.max(-maxX, Math.min(maxX, stateRef.current.x));
    stateRef.current.y = Math.max(-maxY, Math.min(maxY, stateRef.current.y));
  }, []);

  const zoomBy = useCallback((delta, cx, cy) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const prevScale = stateRef.current.scale;
    let nextScale = prevScale + delta;
    nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
    if (nextScale === prevScale) return;

    const originX = cx != null ? cx - rect.width / 2 : 0;
    const originY = cy != null ? cy - rect.height / 2 : 0;

    const ratio = nextScale / prevScale;
    stateRef.current.x = originX - (originX - stateRef.current.x) * ratio;
    stateRef.current.y = originY - (originY - stateRef.current.y) * ratio;
    stateRef.current.scale = nextScale;

    if (nextScale === MIN_SCALE) {
      stateRef.current.x = 0;
      stateRef.current.y = 0;
    } else {
      clamp();
    }
    applyTransform();
    force(f => f + 1);
  }, [applyTransform, clamp]);

  const handleWheelRef = useRef(null);
  handleWheelRef.current = useCallback((e) => {
    e.preventDefault();
    const rect = wrapRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    zoomBy(-e.deltaY * 0.0025, cx, cy);
  }, [zoomBy]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const listener = (e) => handleWheelRef.current(e);
    el.addEventListener('wheel', listener, { passive: false });
    return () => el.removeEventListener('wheel', listener);
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (stateRef.current.scale <= MIN_SCALE) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    wrapRef.current.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    stateRef.current.x += dx;
    stateRef.current.y += dy;
    clamp();
    applyTransform();
  }, [applyTransform, clamp]);

  const handlePointerUp = useCallback((e) => {
    dragging.current = false;
    try { wrapRef.current.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  }, []);

  const handleDoubleClick = useCallback((e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    if (stateRef.current.scale > MIN_SCALE) {
      stateRef.current.scale = MIN_SCALE;
      stateRef.current.x = 0;
      stateRef.current.y = 0;
      applyTransform();
      force(f => f + 1);
    } else {
      zoomBy(1.5, e.clientX - rect.left, e.clientY - rect.top);
    }
  }, [applyTransform, zoomBy]);

  const reset = useCallback(() => {
    stateRef.current = { scale: 1, x: 0, y: 0 };
    applyTransform();
    force(f => f + 1);
  }, [applyTransform]);

  useEffect(() => { applyTransform(); }, [applyTransform]);

  const scale = stateRef.current.scale;

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: scale > MIN_SCALE ? 'grab' : 'default' }}
    >
      <img src={src} alt={alt} draggable={false} className={styles.img} />

      <div className={styles.controls}>
        <button className={styles.ctrlBtn} onClick={() => zoomBy(0.6)} aria-label="Aumentar zoom"><IconPlus /></button>
        <button className={styles.ctrlBtn} onClick={() => zoomBy(-0.6)} aria-label="Diminuir zoom"><IconMinus /></button>
        <button className={styles.ctrlBtn} onClick={reset} aria-label="Restaurar"><IconReset /></button>
      </div>
    </div>
  );
}
