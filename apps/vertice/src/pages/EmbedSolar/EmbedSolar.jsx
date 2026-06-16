import { useState, useRef, useEffect, useCallback } from 'react';
import styles from '../Mod03/Mod03.module.css';

const TOTAL_FRAMES = 122;
const SLIDER_MIN = 1;
const SLIDER_MAX = 120;
const LINE_LEFT = 15;
const LINE_RIGHT = 85;

function thumbLeft(f) {
  const ratio = Math.max(0, Math.min(1, (f - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)));
  return LINE_LEFT + ratio * (LINE_RIGHT - LINE_LEFT);
}

export default function EmbedSolar() {
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
      img.src = `/img/solar/360_${String(i).padStart(5, '0')}.webp`;
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
    if (thumbRef.current) thumbRef.current.style.left = `${thumbLeft(SLIDER_MIN)}%`;
  }, []);

  const onImgDown = useCallback((e) => {
    imgDragX.current = e.clientX;
    imgDragFrame.current = frameRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const onImgMove = useCallback((e) => {
    if (imgDragX.current === null) return;
    applyFrame(imgDragFrame.current + (e.clientX - imgDragX.current) / 5);
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
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <div className={styles.solarWrapper}>
        <img
          ref={displayRef}
          src="/img/solar/360_00001.webp"
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
          <img ref={thumbRef} src="/img/solar/hand.gif" alt="" className={styles.solarThumb} draggable={false} />
        </div>
        {!ready && (
          <div className={styles.solarLoading}>
            <div className={styles.solarLoadBar} style={{ width: `${progress}%` }} />
            <span className={styles.solarLoadText}>{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
