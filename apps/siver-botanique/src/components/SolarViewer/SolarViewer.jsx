import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SolarViewer.module.css';

const TOTAL_FRAMES = 152;
const framePath = (i) => `/solar-frames/frame_${String(i).padStart(5, '0')}.avif`;

const IconHandDrag = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11V5.5a1.5 1.5 0 013 0V11" />
    <path d="M12 11V4.5a1.5 1.5 0 013 0V11" />
    <path d="M15 11.5V7a1.5 1.5 0 013 0v7c0 2.8-2.2 5-5 5h-2a5 5 0 01-4-2l-2.7-3.6a1.2 1.2 0 011.8-1.6L8 12" />
    <path d="M3 7l-2 2 2 2M21 7l2 2-2 2" />
  </svg>
);

export default function SolarViewer() {
  const [frame, setFrame] = useState(20);
  const [loaded, setLoaded] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startFrame = useRef(20);
  const trackRef = useRef(null);

  useEffect(() => {
    let count = 0;
    let done = false;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      const finish = () => {
        count++;
        if (!done && count === TOTAL_FRAMES) { done = true; setLoaded(true); }
      };
      img.onload = finish;
      img.onerror = finish;
    }
  }, []);

  const setFrameFromX = useCallback((clientX) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setFrame(Math.round(ratio * (TOTAL_FRAMES - 1)));
  }, []);

  const onDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startFrame.current = frame;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    const next = startFrame.current + Math.round(dx / 6);
    setFrame(Math.min(TOTAL_FRAMES - 1, Math.max(0, next)));
  };

  const onUp = () => { dragging.current = false; };

  const progress = frame / (TOTAL_FRAMES - 1);

  return (
    <div
      className={styles.viewer}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      {!loaded && <div className={styles.loading}>Carregando...</div>}

      <img
        src={framePath(frame)}
        alt="Orientação solar"
        className={styles.frame}
        draggable={false}
      />

      <img src="/img/solar-icons.avif" alt="" className={styles.iconsRow} draggable={false} />

      <div className={styles.hint}>
        <IconHandDrag />
        <span>Toque e Arraste</span>
      </div>

      <div className={styles.track} ref={trackRef} onPointerDown={(e) => setFrameFromX(e.clientX)}>
        <div className={styles.trackFill} style={{ width: `${progress * 100}%` }} />
        <div className={styles.trackHandle} style={{ left: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
