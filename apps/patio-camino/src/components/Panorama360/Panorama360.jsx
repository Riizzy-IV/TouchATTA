import { useEffect, useRef } from 'react';
import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';
import styles from './Panorama360.module.css';

export default function Panorama360({ src }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    viewerRef.current = window.pannellum.viewer(containerRef.current, {
      type: 'equirectangular',
      panorama: src,
      autoLoad: true,
      showControls: false,
      compass: false,
      hfov: 110,
      minHfov: 50,
      maxHfov: 120,
      pitch: 0,
      yaw: 0,
      friction: 0.15,
    });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [src]);

  return <div ref={containerRef} className={styles.viewer} />;
}
