import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './OrientacaoSolar.module.css';

const TOTAL_FRAMES = 120;
const SLIDER_MIN = 0;
const SLIDER_MAX = TOTAL_FRAMES - 1;
const LINE_LEFT = 15;
const LINE_RIGHT = 85;
const PX_PER_FRAME = 5;

const framePath = (i) => `/img/solar/360_${String(i).padStart(5, '0')}.webp`;

function thumbLeft(f) {
  const ratio = Math.max(0, Math.min(1, (f - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)));
  return LINE_LEFT + ratio * (LINE_RIGHT - LINE_LEFT);
}

export default function OrientacaoSolar() {
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
      img.onload = () => setLoaded((n) => n + 1);
      img.src = framePath(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => imgs.forEach((img) => { img.onload = null; });
  }, []);

  useEffect(() => {
    if (thumbRef.current) thumbRef.current.style.left = `${thumbLeft(SLIDER_MIN)}%`;
  }, []);

  const applyFrame = useCallback((f) => {
    const c = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, Math.round(f)));
    frameRef.current = c;
    if (displayRef.current)
      displayRef.current.src = imagesRef.current[c]?.src ?? displayRef.current.src;
    if (thumbRef.current)
      thumbRef.current.style.left = `${thumbLeft(c)}%`;
  }, []);

  const onImgDown = useCallback((e) => {
    imgDragX.current = e.clientX;
    imgDragFrame.current = frameRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const onImgMove = useCallback((e) => {
    if (imgDragX.current === null) return;
    applyFrame(imgDragFrame.current + (e.clientX - imgDragX.current) / PX_PER_FRAME);
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
    const fDelta = ((e.clientX - barDragX.current) / lineW) * (SLIDER_MAX - SLIDER_MIN);
    applyFrame(barDragFrame.current + fDelta);
  }, [applyFrame]);

  const onBarUp = useCallback((e) => {
    barDragX.current = null;
    e.currentTarget.style.cursor = 'grab';
  }, []);

  const progress = Math.round((loaded / TOTAL_FRAMES) * 100);
  const ready = loaded === TOTAL_FRAMES;

  return (
    <div className={styles.wrapper}>
      <img
        ref={displayRef}
        src={framePath(SLIDER_MIN)}
        alt="Orientação solar"
        className={styles.img}
        draggable={false}
        onPointerDown={onImgDown}
        onPointerMove={onImgMove}
        onPointerUp={onImgUp}
        onPointerLeave={onImgUp}
        style={{ cursor: 'grab' }}
      />

      <div
        ref={barRef}
        className={styles.bar}
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        onPointerUp={onBarUp}
        onPointerLeave={onBarUp}
        style={{ cursor: 'grab' }}
      >
        <img src="/img/solar/oriente.png" alt="" className={styles.oriente} draggable={false} />
        <div className={styles.trackLine} />
        <img ref={thumbRef} src="/img/solar/hand.gif" alt="" className={styles.thumb} draggable={false} />
      </div>

      <div className={`${styles.preload} ${ready ? styles.preloadOut : ''}`}>
        <div className={styles.loadTrack}>
          <div className={styles.loadBar} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.loadLabel}>Carregando {progress}%</span>
      </div>
    </div>
  );
}
