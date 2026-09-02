import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Implantacao.module.css';

const FLOORS = [
  {
    id: 'geral',
    label: 'Implantação',
    src: '/img/implantacao/site-plan.avif',
    ratio: '2200 / 1238',
    items: [
      { id: 1, label: 'Praça Eden Sky',       x: 30.5, y: 46.5 },
      { id: 2, label: 'Parquinho',            x: 39.5, y: 71.5, image: '/img/areas/parquinho.avif' },
      { id: 3, label: 'Quadra Poliesportiva', x: 79.5, y: 18.5, image: '/img/areas/poliesportiva.avif' },
      { id: 4, label: 'Espaço Gourmet',       x: 82,   y: 42,   image: '/img/areas/gourmet.avif' },
      { id: 5, label: 'Piscina',              x: 91,   y: 74,   image: '/img/areas/piscina.avif' },
    ],
  },
  {
    id: 'mezanino',
    label: 'Mezanino',
    src: '/img/implantacao/mezanino.avif',
    ratio: '2200 / 2200',
    items: [
      { id: 1, label: 'Crio-Recovery',   x: 16.5, y: 16.5 },
      { id: 2, label: 'Academia',        x: 23,   y: 45.3, image: '/img/areas/academia.avif' },
      { id: 3, label: 'Sala de Massagem',x: 67.5, y: 27 },
      { id: 4, label: 'Pilates',         x: 72.3, y: 40,   image: '/img/areas/pilates.avif' },
      { id: 5, label: 'Lounge Gym',      x: 49.3, y: 52.5 },
      { id: 6, label: 'Salão de Beleza', x: 75,   y: 57,   image: '/img/areas/salao-beleza.avif' },
    ],
  },
];

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Implantacao() {
  const [floorId, setFloorId] = useState('geral');
  const [active, setActive]   = useState(null);
  const [popup, setPopup]     = useState(null);

  const wrapperRef  = useRef(null);
  const imageRef    = useRef(null);
  const panelRef    = useRef(null);
  const listRowRefs = useRef([]);
  const pinRefs     = useRef([]);
  const popupRef    = useRef(null);

  const floor = FLOORS.find(f => f.id === floorId);

  useEffect(() => {
    setActive(null);
    listRowRefs.current = [];
    pinRefs.current = [];
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(imageRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5 }
      )
      .fromTo(panelRef.current,
        { x: 24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45 },
        '-=0.3'
      )
      .fromTo(listRowRefs.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, stagger: 0.07 },
        '-=0.2'
      )
      .fromTo(pinRefs.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(1.8)' },
        '-=0.4'
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, [floorId]);

  const openPopup = (item) => setPopup(item);

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
      <div className={styles.floorTabs}>
        {FLOORS.map(f => (
          <button
            key={f.id}
            className={`${styles.floorTab} ${floorId === f.id ? styles.floorTabActive : ''}`}
            onClick={() => setFloorId(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.mainRow}>
        <div className={styles.imageArea} style={{ aspectRatio: floor.ratio }}>
          <img
            ref={imageRef}
            key={floor.id}
            src={floor.src}
            alt={floor.label}
            className={styles.img}
            draggable={false}
          />
          {floor.items.map((item, i) => (
            <button
              key={item.id}
              ref={el => (pinRefs.current[i] = el)}
              className={`${styles.pin} ${active === item.id ? styles.pinActive : ''}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onPointerEnter={() => setActive(item.id)}
              onPointerLeave={() => setActive(null)}
              onClick={() => openPopup(item)}
            >
              <span className={styles.pinRing} />
              {item.id}
            </button>
          ))}
        </div>

        <div className={styles.panel} ref={panelRef}>
          <div className={styles.list}>
            {floor.items.map((item, i) => (
              <div
                key={item.id}
                ref={el => (listRowRefs.current[i] = el)}
                className={`${styles.listRow} ${active === item.id ? styles.listRowActive : ''}`}
                onPointerEnter={() => setActive(item.id)}
                onPointerLeave={() => setActive(null)}
                onClick={() => openPopup(item)}
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
              {popup.image ? (
                <img src={popup.image} alt={popup.label} className={styles.popupImg} draggable={false} />
              ) : (
                <>
                  <span className={styles.emBreveLabel}>Em breve</span>
                  <p className={styles.emBreveText}>{popup.label}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
