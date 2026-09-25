import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Implantacao.module.css';

const ITEMS = [
  { id: 1, label: 'Receptivo',         x: 21, y: 61, image: '/img/galeria/receptivo.webp' },
  { id: 2, label: 'Quadras de Tênis',  x: 25, y: 49, image: '/img/galeria/quadras-tenis.webp' },
  { id: 3, label: 'Quadra de Areia',   x: 59, y: 50, image: '/img/galeria/quadra-areia.webp' },
  { id: 4, label: 'Rio Lento',         x: 35, y: 66, image: '/img/galeria/rio-lento.webp' },
  { id: 5, label: 'Lounge Aquático',   x: 46, y: 66, image: '/img/galeria/lounge-aquatico.webp' },
  { id: 6, label: 'Piscina de Ondas',  x: 78, y: 67, image: '/img/galeria/piscina-ondas.webp' },
  { id: 7, label: 'Praia Artificial',  x: 78, y: 56, image: '/img/galeria/praia-artificial.webp' },
  { id: 8, label: 'Day Beds',          x: 79, y: 75, image: '/img/galeria/day-beds.webp' },
  { id: 9, label: 'Mall Aberto',       x: 86, y: 60, image: '/img/galeria/lojas.webp' },
];

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Implantacao() {
  const [active, setActive] = useState(null);
  const [popup, setPopup]   = useState(null);

  const wrapperRef  = useRef(null);
  const imageRef    = useRef(null);
  const panelRef    = useRef(null);
  const listRowRefs = useRef([]);
  const pinRefs     = useRef([]);
  const popupRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(imageRef.current, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5 })
        .fromTo(panelRef.current, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, '-=0.3')
        .fromTo(listRowRefs.current, { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.06 }, '-=0.2')
        .fromTo(pinRefs.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(1.8)' }, '-=0.4');
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (popup && popupRef.current) {
      gsap.fromTo(popupRef.current,
        { opacity: 0, scale: 0.9, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.4)' }
      );
    }
  }, [popup]);

  const closePopup = (e) => {
    e.stopPropagation();
    if (!popupRef.current) { setPopup(null); return; }
    gsap.to(popupRef.current, {
      opacity: 0, scale: 0.92, y: 10, duration: 0.18, ease: 'power2.in',
      onComplete: () => setPopup(null),
    });
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.mainRow}>
        <div className={styles.imageArea} style={{ aspectRatio: '2000 / 1251' }}>
          <img
            ref={imageRef}
            src="/img/implantacao/site-plan.webp"
            alt="Implantação Reserva Beach Club"
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
              onClick={() => setPopup(item)}
            >
              <span className={styles.pinRing} />
              {item.id}
            </button>
          ))}
        </div>

        <div className={styles.panel} ref={panelRef}>
          <div className={styles.list}>
            {ITEMS.map((item, i) => (
              <div
                key={item.id}
                ref={el => (listRowRefs.current[i] = el)}
                className={`${styles.listRow} ${active === item.id ? styles.listRowActive : ''}`}
                onPointerEnter={() => setActive(item.id)}
                onPointerLeave={() => setActive(null)}
                onClick={() => setPopup(item)}
              >
                <span className={styles.chip}>{item.id}</span>
                <span className={styles.listLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {popup && (
        <div className={styles.popupBackdrop} onClick={closePopup}>
          <div className={styles.popup} ref={popupRef} onClick={e => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <span className={styles.popupChip}>{popup.id}</span>
              <span className={styles.popupTitle}>{popup.label}</span>
              <button className={styles.popupClose} onClick={closePopup}>
                <IconClose />
              </button>
            </div>
            <div className={styles.popupImage}>
              <img src={popup.image} alt={popup.label} className={styles.popupImg} draggable={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
