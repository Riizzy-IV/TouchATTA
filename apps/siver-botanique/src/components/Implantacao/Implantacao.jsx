import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Implantacao.module.css';

const ITEMS = [
  { id: 1, label: 'Estacionamento',        x: 16, y: 52 },
  { id: 2, label: 'Piscina',               x: 38, y: 30 },
  { id: 3, label: 'Deck / Solarium',       x: 51, y: 25 },
  { id: 4, label: 'Área Gourmet',          x: 43, y: 43 },
  { id: 5, label: 'Quadra Poliesportiva',  x: 62, y: 27 },
  { id: 6, label: 'Quadra de Areia',       x: 64, y: 42 },
  { id: 9, label: 'Torre Residencial',     x: 57, y: 63 },
];

export default function Implantacao() {
  const [active, setActive] = useState(null);

  const wrapperRef  = useRef(null);
  const imageRef    = useRef(null);
  const panelRef    = useRef(null);
  const titleRef    = useRef(null);
  const listRowRefs = useRef([]);
  const pinRefs     = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. imagem entra da esquerda
      tl.fromTo(imageRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      )

      // 2. painel entra com fade + y
      .fromTo(panelRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 },
        '-=0.4'
      )

      // 3. título sobe
      .fromTo(titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        '-=0.3'
      )

      // 4. lista em stagger
      .fromTo(listRowRefs.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.09 },
        '-=0.25'
      )

      // 5. pins pop com stagger
      .fromTo(pinRefs.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(1.8)' },
        '-=0.5'
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      {/* Imagem + pins */}
      <div className={styles.imageArea} ref={imageRef}>
        <img
          src="/img/implantacao/geral_planta.avif"
          alt="Implantação"
          className={styles.img}
          draggable={false}
        />
        {ITEMS.map((item, i) => (
          <button
            key={item.id}
            ref={el => (pinRefs.current[i] = el)}
            className={`${styles.pin} ${active === item.id ? styles.pinActive : ''}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onPointerEnter={() => setActive(item.id)}
            onPointerLeave={() => setActive(null)}
          >
            <span className={styles.pinRing} />
            {item.id}
          </button>
        ))}
      </div>

      {/* Painel lateral */}
      <div className={styles.panel} ref={panelRef}>
        <h2 className={styles.panelTitle} ref={titleRef}>IMPLANTAÇÃO</h2>
        <div className={styles.list}>
          {ITEMS.map((item, i) => (
            <div
              key={item.id}
              ref={el => (listRowRefs.current[i] = el)}
              className={`${styles.listRow} ${active === item.id ? styles.listRowActive : ''}`}
              onPointerEnter={() => setActive(item.id)}
              onPointerLeave={() => setActive(null)}
            >
              <span className={styles.chip}>{item.id}</span>
              <span className={styles.listLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
