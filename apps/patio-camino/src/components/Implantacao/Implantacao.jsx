import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Implantacao.module.css';

const ITEMS = [
  { id: 1,  label: 'Galeria comercial',            x: 13,   y: 65.3 },
  { id: 2,  label: 'Minicampo infantil',            x: 49.3, y: 75,   photo: '/img/areas-minicampo.jpg' },
  { id: 3,  label: 'Espaço Crossfit',                x: 44,   y: 86.8, photo: '/img/areas-crossfit.jpg' },
  { id: 4,  label: 'Gazebo Grill',                   x: 64.6, y: 89.8, photo: '/img/areas-gazebo.jpg' },
  { id: 5,  label: 'Praça Piquenique',               x: 89.3, y: 77.5, photo: '/img/areas-piquenique.jpg' },
  { id: 6,  label: 'Piscina adulto com prainha',     x: 78,   y: 52.8, photo: '/img/hero-piscina.jpg' },
  { id: 7,  label: 'Espaço Festas com copa',         x: 87.2, y: 52.6, photo: '/img/areas-festas.jpg' },
  { id: 8,  label: 'Espaço Kids',                    x: 97.5, y: 37.5 },
  { id: 9,  label: 'Brinquedoteca',                  x: 93.2, y: 38.6, photo: '/img/areas-brinquedoteca.jpg' },
  { id: 10, label: 'Espaço para Self Market',        x: 89.2, y: 31.1, photo: '/img/areas-minimarket.jpg' },
  { id: 11, label: 'Parque da infância',             x: 84.7, y: 27.9, photo: '/img/areas-playground.jpg' },
  { id: 12, label: 'WCs',                            x: 93.1, y: 46.8 },
  { id: 13, label: 'Academia',                       x: 87.8, y: 44.2, photo: '/img/areas-academia.jpg' },
  { id: 14, label: 'Gazebo Grill',                   x: 84.3, y: 92,   photo: '/img/areas-gazebo.jpg' },
  { id: 15, label: 'Pet Place / Pet Wash',           x: 92,   y: 65.9, photo: '/img/areas-petplace.jpg' },
  { id: 16, label: 'Piscina infantil',               x: 71.3, y: 59.5, photo: '/img/hero-piscina.jpg' },
  { id: 17, label: 'Sala multimídia',                x: 94.1, y: 29.4, photo: '/img/areas-salamultimidia.jpg' },
  { id: 18, label: 'Deck',                           x: 81.9, y: 58.2 },
  { id: 19, label: 'Redário',                        x: 75.3, y: 91.1 },
];

const SUBTABS = [
  { id: 'geral',        label: 'Geral' },
  { id: 'lazer-terreo', label: 'Bloco Lazer · Térreo' },
  { id: 'lazer-pav1',   label: 'Bloco Lazer · Pav. 1' },
];

const ITEMS_TERREO = [
  { id: 1, label: 'Sala multimídia',           x: 68.0, y: 15.0, photo: '/img/areas-salamultimidia.jpg' },
  { id: 2, label: 'Espaço para Self Market',   x: 20.0, y: 35.0, photo: '/img/areas-minimarket.jpg' },
  { id: 3, label: 'Brinquedoteca',             x: 55.0, y: 33.0, photo: '/img/areas-brinquedoteca.jpg' },
  { id: 4, label: 'WCs',                       x: 78.0, y: 40.0 },
  { id: 5, label: 'Espaço Festas com copa',    x: 45.0, y: 78.0, photo: '/img/areas-festas.jpg' },
];

const ITEMS_PAV1 = [
  { id: 1, label: 'Academia',        x: 50.0, y: 28.0, photo: '/img/areas-academia.jpg' },
  { id: 2, label: 'Espaço Crossfit', x: 50.0, y: 73.0, photo: '/img/areas-crossfit.jpg' },
];

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Implantacao() {
  const canEditPins = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('editpins');
  const [activeSub, setActiveSub] = useState('geral');
  const [active, setActive]   = useState(null);
  const [popup, setPopup]     = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [items, setItems]     = useState(ITEMS);
  const [terreoItems, setTerreoItems] = useState(ITEMS_TERREO);
  const [pav1Items, setPav1Items]     = useState(ITEMS_PAV1);
  const [copied, setCopied]   = useState(false);

  const wrapperRef  = useRef(null);
  const imageRef    = useRef(null);
  const floorImgRef = useRef(null);
  const panelRef    = useRef(null);
  const titleRef    = useRef(null);
  const listRowRefs = useRef([]);
  const pinRefs     = useRef([]);
  const popupRef    = useRef(null);
  const dragRef     = useRef(null);

  const setterFor = (sub) => sub === 'geral' ? setItems : sub === 'lazer-terreo' ? setTerreoItems : setPav1Items;
  const itemsFor = (sub) => sub === 'geral' ? items : sub === 'lazer-terreo' ? terreoItems : pav1Items;

  useEffect(() => {
    if (!editMode) return;
    const onMove = (e) => {
      if (!dragRef.current) return;
      const container = activeSub === 'geral' ? imageRef.current : floorImgRef.current;
      const rect = container.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
      setterFor(activeSub)(prev => prev.map(it => it.id === dragRef.current ? { ...it, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } : it));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [editMode, activeSub]);

  const copyItems = () => {
    const code = itemsFor(activeSub)
      .map(it => `  { id: ${it.id},${' '.repeat(Math.max(1, 3 - String(it.id).length))}label: '${it.label}',${' '.repeat(Math.max(1, 36 - it.label.length))}x: ${it.x}, y: ${it.y} },`)
      .join('\n');
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
        {canEditPins && (
          <button
            className={`${styles.editToggle} ${editMode ? styles.editToggleActive : ''}`}
            onClick={() => setEditMode(v => !v)}
          >
            {editMode ? 'Sair da edição' : 'Editar posição dos pins'}
          </button>
        )}
      </div>

      {editMode && (
        <div className={styles.editPanel}>
          <p className={styles.editHint}>Arraste os pins no mapa. Quando terminar, copie o código e me envie.</p>
          <button className={styles.editCopyBtn} onClick={copyItems}>
            {copied ? 'Copiado!' : 'Copiar posições'}
          </button>
        </div>
      )}

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
            {items.map((item, i) => (
              <button
                key={item.id}
                ref={el => (pinRefs.current[i] = el)}
                className={`${styles.pin} ${active === item.id ? styles.pinActive : ''} ${editMode ? styles.pinEditable : ''}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onPointerEnter={() => setActive(item.id)}
                onPointerLeave={() => setActive(null)}
                onMouseDown={(e) => { if (editMode) { e.preventDefault(); dragRef.current = item.id; } }}
                onClick={() => { if (!editMode) openPopup(item); }}
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
            <div className={styles.floorImgWrap}>
              <img
                ref={floorImgRef}
                src={FLOOR_INFO[activeSub].src}
                alt={`${FLOOR_INFO[activeSub].title} - ${FLOOR_INFO[activeSub].subtitle}`}
                className={styles.floorImg}
                draggable={false}
              />
              {itemsFor(activeSub).map(item => (
                <button
                  key={item.id}
                  className={`${styles.pin} ${active === item.id ? styles.pinActive : ''} ${editMode ? styles.pinEditable : ''}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  onPointerEnter={() => setActive(item.id)}
                  onPointerLeave={() => setActive(null)}
                  onMouseDown={(e) => { if (editMode) { e.preventDefault(); dragRef.current = item.id; } }}
                  onClick={() => { if (!editMode) openPopup(item); }}
                >
                  <span className={styles.pinRing} />
                  {item.id}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>{FLOOR_INFO[activeSub].title}</h2>
            <span className={styles.floorSubtitle}>{FLOOR_INFO[activeSub].subtitle}</span>
            <div className={styles.list} style={{ marginTop: 24 }}>
              {itemsFor(activeSub).map(item => (
                <div
                  key={item.id}
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
              {popup.photo ? (
                <img src={popup.photo} alt={popup.label} className={styles.popupPhoto} draggable={false} />
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
