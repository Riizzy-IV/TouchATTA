import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './FachadaInterativa.module.css';

const TYPES = [
  { id: 'base',   label: 'Fachada' },
  { id: 'a',      label: 'Tipo A' },
  { id: 'b1',     label: 'Tipo B1' },
  { id: 'b2',     label: 'Tipo B2' },
  { id: 'c',      label: 'Tipo C' },
  { id: 'd',      label: 'Tipo D' },
  { id: 'terreo', label: 'Térreo' },
];

export default function FachadaInterativa() {
  const [active, setActive] = useState('base');
  const wrapperRef = useRef(null);
  const imageRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, [active]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.imageArea}>
        <img
          ref={imageRef}
          key={active}
          src={`/img/fachada-interativa/${active}.avif`}
          alt={TYPES.find(t => t.id === active).label}
          className={styles.img}
          draggable={false}
        />
      </div>

      <div className={styles.tabs}>
        {TYPES.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
