import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Implantacao.module.css';

const ITEMS = [
  { id: 1, label: 'Lojas / Fachada Ativa', x: 10, y: 63 },
  { id: 2, label: 'Estacionamento',        x: 21, y: 32 },
  { id: 3, label: 'Vagas PCD',             x: 61, y: 50 },
  { id: 4, label: 'Piscina',               x: 77, y: 55 },
  { id: 5, label: 'Quadra Poliesportiva',  x: 50, y: 78 },
  { id: 6, label: 'Bloco A',               x: 66, y: 35 },
  { id: 7, label: 'Bloco B',               x: 69, y: 78 },
];

const SUBTABS = [
  { id: 'geral',        label: 'Geral' },
  { id: 'lazer-terreo', label: 'Bloco Lazer · Térreo' },
  { id: 'lazer-pav1',   label: 'Bloco Lazer · Pav. 1' },
];

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Implantacao() {
  const [activeSub, setActiveSub] = useState('geral');
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

  const FLOOR_INFO = {
    'lazer-terreo': { src: '/img/implantacao-lazer-terreo.jpg', title: 'BLOCO LAZER', subtitle: 'Térreo' },
    'lazer-pav1':   { src: '/img/implantacao-lazer-pav1.jpg',   title: 'BLOCO LAZER', subtitle: 'Pavimento 1' },
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      {/* Sub-navegação */}
      <div className={styles.subTabs}>
        {SUBTABS.map(t => (
          <button
            key={t.id}
            className={`${styles.subTab} ${activeSub === t.id ? styles.subTabActive : ''}`}
            onClick={() => setActiveSub(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.mainRow}>
      {activeSub === 'geral' ? (
        <>
          {/* Imagem + pins */}
          <div className={styles.imageArea} ref={imageRef}>
            <img
              src="/img/implantacao-masterplan.png"
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
            <h2 className={styles.panelTitle} ref={titleRef}>IMPLANTAÇÃO</h2>
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
        </>
      ) : (
        <>
          {/* Planta do bloco lazer */}
          <div className={styles.floorArea}>
            <img
              src={FLOOR_INFO[activeSub].src}
              alt={`${FLOOR_INFO[activeSub].title} - ${FLOOR_INFO[activeSub].subtitle}`}
              className={styles.floorImg}
              draggable={false}
            />
          </div>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>{FLOOR_INFO[activeSub].title}</h2>
            <span className={styles.floorSubtitle}>{FLOOR_INFO[activeSub].subtitle}</span>
          </div>
        </>
      )}
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
              <span className={styles.emBreveLabel}>EM BREVE</span>
              <p className={styles.emBreveText}>{popup.label.toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
