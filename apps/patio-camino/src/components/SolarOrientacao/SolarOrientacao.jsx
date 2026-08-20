import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './SolarOrientacao.module.css';

const TOTAL_FRAMES = 152;
const SLIDER_MIN = 0;
const SLIDER_MAX = 151;
const LINE_LEFT = 15;
const LINE_RIGHT = 85;
const framePath = (i) => `/solar-frames/frame_${String(i).padStart(5, '0')}.avif`;

function thumbLeft(f) {
  const ratio = Math.max(0, Math.min(1, (f - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)));
  return LINE_LEFT + ratio * (LINE_RIGHT - LINE_LEFT);
}

export default function SolarOrientacao() {
  const [loaded, setLoaded] = useState(0);
  const imagesRef = useRef([]);
  const displayRef = useRef(null);
  const thumbRef = useRef(null);
  const barRef = useRef(null);
  const frameRef = useRef(SLIDER_MIN);

  const imgDragX = useRef(null);
  const imgDragFrame = useRef(SLIDER_MIN);

  const barDragX = useRef(null);
  const barDragFrame = useRef(SLIDER_MIN);

  useEffect(() => {
    const imgs = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => setLoaded(n => n + 1);
      img.src = framePath(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => imgs.forEach(img => { img.onload = null; });
  }, []);

  const applyFrame = useCallback((f) => {
    const c = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, Math.round(f)));
    frameRef.current = c;
    if (displayRef.current)
      displayRef.current.src = imagesRef.current[c]?.src ?? displayRef.current.src;
    if (thumbRef.current)
      thumbRef.current.style.left = `${thumbLeft(c)}%`;
  }, []);

  useEffect(() => {
    if (thumbRef.current)
      thumbRef.current.style.left = `${thumbLeft(SLIDER_MIN)}%`;
  }, []);

  const onImgDown = useCallback((e) => {
    imgDragX.current = e.clientX;
    imgDragFrame.current = frameRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const onImgMove = useCallback((e) => {
    if (imgDragX.current === null) return;
    const delta = e.clientX - imgDragX.current;
    applyFrame(imgDragFrame.current + delta / 5);
  }, [applyFrame]);

  const onImgUp = useCallback((e) => {
    imgDragX.current = null;
    e.currentTarget.style.cursor = 'grab';
  }, []);

  const onBarDown = useCallback((e) => {
    barDragX.current = e.clientX;
    barDragFrame.current = frameRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const onBarMove = useCallback((e) => {
    if (barDragX.current === null) return;
    const barW = barRef.current?.getBoundingClientRect().width ?? 1;
    const lineW = barW * (LINE_RIGHT - LINE_LEFT) / 100;
    const delta = e.clientX - barDragX.current;
    const fDelta = (delta / lineW) * (SLIDER_MAX - SLIDER_MIN);
    applyFrame(barDragFrame.current + fDelta);
  }, [applyFrame]);

  const onBarUp = useCallback((e) => {
    barDragX.current = null;
    e.currentTarget.style.cursor = 'grab';
  }, []);

  const progress = Math.round((loaded / TOTAL_FRAMES) * 100);
  const ready = loaded === TOTAL_FRAMES;

  const [showPreload, setShowPreload] = useState(true);
  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => setShowPreload(false), 500);
      return () => clearTimeout(t);
    }
  }, [ready]);

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className={styles.solarWrapper}>
      <img
        ref={displayRef}
        src={framePath(1)}
        alt="orientação solar"
        className={styles.solarImg}
        draggable={false}
        onPointerDown={onImgDown}
        onPointerMove={onImgMove}
        onPointerUp={onImgUp}
        onPointerLeave={onImgUp}
        style={{ cursor: 'grab' }}
      />

      <div
        ref={barRef}
        className={styles.solarBar}
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        onPointerUp={onBarUp}
        onPointerLeave={onBarUp}
        style={{ cursor: 'grab' }}
      >
        <img src="/img/solar/oriente.png" alt="" className={styles.solarOriente} draggable={false} />
        <div className={styles.solarTrackLine} />
        <img
          ref={thumbRef}
          src="/img/solar/hand.gif"
          alt=""
          className={styles.solarThumb}
          draggable={false}
        />
      </div>

      {showPreload && (
        <div className={`${styles.solarPreload} ${ready ? styles.solarPreloadOut : ''}`}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="48" cy="48" r={radius} fill="none"
              stroke="#2a9aaa" strokeWidth="3"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.15s linear' }}
            />
            <text x="48" y="53" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="15" fontFamily="Open Sans, sans-serif" fontWeight="600">{progress}%</text>
          </svg>
          <span className={styles.solarPreloadLabel}>CARREGANDO</span>
        </div>
      )}
    </div>
  );
}
