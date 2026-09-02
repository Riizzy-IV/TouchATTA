import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Implantacao.module.css';

const ITEMS = [
  { id: 1,  label: 'Estacionamento',        x: 16,   y: 52 },
  { id: 2,  label: 'Piscina',               x: 44,   y: 34,   image: '/img/areas/piscina/piscina.avif' },
  { id: 3,  label: 'Churrasqueira',         x: 35.8, y: 49.1, image: '/img/areas/churrasqueira/churrasqueira.avif' },
  { id: 4,  label: 'Salão de Festas',       x: 41.3, y: 49.2, image: '/img/areas/salao-de-festas/salao-de-festas.avif' },
  { id: 5,  label: 'Quadra de Street Ball', x: 58.5, y: 33.7, image: '/img/areas/quadra/quadra.avif' },
  { id: 6,  label: 'Quadra de Beach Tennis',x: 59.5, y: 46,   image: '/img/areas/beach-tennis/beach-tennis.avif' },
  { id: 7,  label: 'Espaço Teen',           x: 68.4, y: 52.4, image: '/img/areas/teen/teen.avif' },
  { id: 8,  label: 'Brinquedoteca',         x: 67.5, y: 64.9, image: '/img/areas/brinquedoteca/brinquedoteca.avif' },
  { id: 9,  label: 'Academia',              x: 47.1, y: 60.6, image: '/img/areas/academia/academia.avif' },
  { id: 10, label: 'Playground',            x: 62.9, y: 73.2, image: '/img/areas/playground/playground.avif' },
  { id: 11, label: 'Espaço Pet',            x: 47.7, y: 89.4, image: '/img/areas/petplace/petplace.avif' },
  { id: 12, label: 'Academia ao Ar Livre',  x: 63.6, y: 91.6, image: '/img/areas/fitness/fitness.avif' },
  { id: 13, label: 'Torre Aroeira',         x: 47.9, y: 70.3 },
  { id: 14, label: 'Torre Araucária',       x: 74.4, y: 64.4 },
];

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Implantacao() {
  const [active, setActive]   = useState(null);
  const [popup, setPopup]     = useState(null);

  const wrapperRef  = useRef(null);
  const imageRef    = useRef(null);
  const panelRef    = useRef(null);
  const titleRef    = useRef(null);
  const listRowRefs = useRef([]);
  const pinRefs     = useRef([]);
  const popupRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(imageRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      )
      .fromTo(panelRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 },
        '-=0.4'
      )
      .fromTo(titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        '-=0.3'
      )
      .fromTo(listRowRefs.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.09 },
        '-=0.25'
      )
      .fromTo(pinRefs.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(1.8)' },
        '-=0.5'
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  const openPopup = (item) => {
    setPopup(item);
  };

  useEffect(() => {
    if (popup && popupRef.current) {
      gsap.fromTo(popupRef.current,
        { opacity: 0, scale: 0.88, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
      );
    }
  }, [popup]);

  const closePopup = (e) => {
    e.stopPropagation();
    if (!popupRef.current) { setPopup(null); return; }
    gsap.to(popupRef.current, {
      opacity: 0, scale: 0.9, y: 12, duration: 0.2, ease: 'power2.in',
      onComplete: () => setPopup(null),
    });
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      {/* Imagem + pins */}
      <div className={styles.imageArea} ref={imageRef}>
        <h2 className={styles.panelTitle} ref={titleRef}>IMPLANTAÇÃO</h2>
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
            onClick={() => openPopup(item)}
          >
            <span className={styles.pinRing} />
            {item.id}
          </button>
        ))}
      </div>

      {/* Painel lateral */}
      <div className={styles.panel} ref={panelRef}>
        <div className={styles.list}>
          {ITEMS.map((item, i) => (
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

      {/* Popup */}
      {popup && (
        <div className={styles.popupBackdrop} onClick={closePopup}>
          <div
            className={styles.popup}
            ref={popupRef}
            onClick={e => e.stopPropagation()}
          >
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
                  <span className={styles.emBreveLabel}>EM BREVE</span>
                  <p className={styles.emBreveText}>{popup.label.toUpperCase()}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
