import { useState, useRef, useEffect, useCallback } from 'react';
import ModuleLayout from '../../components/ModuleLayout/ModuleLayout';
import styles from './Mod03.module.css';

const TABS = [
  'FICHA TÉCNICA',
  'SETORIZAÇÃO',
  'IMPLANTAÇÃO',
  'FACHADA INTERATIVA',
  'ORIENTAÇÃO SOLAR',
  'TOUR VIRTUAL',
  'DIFERENCIAIS',
];

/* ── Orientação Solar ───────────────────────────────────────────────────── */
const TOTAL_FRAMES = 120;
const SLIDER_MIN = 0;
const SLIDER_MAX = 119;
const LINE_LEFT = 15;   // % da largura da barra onde a linha começa
const LINE_RIGHT = 85;   // % da largura da barra onde a linha termina

function thumbLeft(f) {
  const ratio = Math.max(0, Math.min(1, (f - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)));
  return LINE_LEFT + ratio * (LINE_RIGHT - LINE_LEFT);
}

function OrientacaoSolarView() {
  const [loaded, setLoaded] = useState(0);
  const imagesRef = useRef([]);
  const displayRef = useRef(null);
  const thumbRef = useRef(null);
  const barRef = useRef(null);
  const frameRef = useRef(SLIDER_MIN);

  /* refs de drag — imagem */
  const imgDragX = useRef(null);
  const imgDragFrame = useRef(SLIDER_MIN);

  /* refs de drag — barra */
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

  /* atualiza imagem + thumb direto no DOM — zero re-render, trava nas pontas */
  const applyFrame = useCallback((f) => {
    const c = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, Math.round(f)));
    frameRef.current = c;
    if (displayRef.current)
      displayRef.current.src = imagesRef.current[c]?.src ?? displayRef.current.src;
    if (thumbRef.current)
      thumbRef.current.style.left = `${thumbLeft(c)}%`;
  }, []);

  /* posição inicial do thumb */
  useEffect(() => {
    if (thumbRef.current)
      thumbRef.current.style.left = `${thumbLeft(SLIDER_MIN)}%`;
  }, []);

  /* ── Drag na imagem (rotação orbital) ── */
  const onImgDown = useCallback((e) => {
    imgDragX.current = e.clientX;
    imgDragFrame.current = frameRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const onImgMove = useCallback((e) => {
    if (imgDragX.current === null) return;
    const delta = e.clientX - imgDragX.current;
    applyFrame(imgDragFrame.current + delta / 5); // clamp nas pontas
  }, [applyFrame]);

  const onImgUp = useCallback((e) => {
    imgDragX.current = null;
    e.currentTarget.style.cursor = 'grab';
  }, []);

  /* ── Drag na barra (slider do gif) ── */
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
    const delta = e.clientX - barDragX.current;
    const fDelta = (delta / lineW) * (SLIDER_MAX - SLIDER_MIN);
    applyFrame(barDragFrame.current + fDelta); // clamp, direita = mais frames
  }, [applyFrame]);

  const onBarUp = useCallback((e) => {
    barDragX.current = null;
    e.currentTarget.style.cursor = 'grab';
  }, []);

  const progress = Math.round((loaded / TOTAL_FRAMES) * 100);
  const ready = loaded === TOTAL_FRAMES;

  const [showPreload, setShowPreload] = useState(true);
  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => setShowPreload(false), 500);
      return () => clearTimeout(t);
    }
  }, [ready]);

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className={styles.solarWrapper}>
      {/* imagem arrastável */}
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

      {/* barra inferior — drag direto, sem input range */}
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
        <img
          ref={thumbRef}
          src="/img/solar/hand.gif"
          alt=""
          className={styles.solarThumb}
          draggable={false}
        />
      </div>

      {showPreload && (
        <div className={`${styles.solarPreload} ${ready ? styles.solarPreloadOut : ''}`}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="48" cy="48" r={radius} fill="none"
              stroke="#2a9aaa" strokeWidth="3"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.15s linear' }}
            />
            <text x="48" y="53" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="15" fontFamily="Open Sans, sans-serif" fontWeight="600">{progress}%</text>
          </svg>
          <span className={styles.solarPreloadLabel}>CARREGANDO</span>
        </div>
      )}
    </div>
  );
}

/* ── Setorização ────────────────────────────────────────────────────────── */
const ZONAS = [
  { id: 'studios', label: 'STUDIOS', sub: 'Torre única', img: '/img/setorizacao/setor_studios.jpg' },
  { id: '1dorm', label: '1 DORMITÓRIO', sub: 'Torre única', img: '/img/setorizacao/setor_1dorm.jpg' },
  { id: 'lazer', label: 'LAZER', sub: 'Áreas de lazer', img: '/img/setorizacao/setor_lazer.jpg' },
  { id: 'rua', label: 'NÍVEL DA RUA', sub: 'Térreo e acesso', img: '/img/setorizacao/setor_rua.jpg' },
];

function SetorizacaoView() {
  const [active, setActive] = useState(null);

  const zoneImg = active ? ZONAS.find(z => z.id === active)?.img : null;

  const handleClick = (zoneId) => setActive(active === zoneId ? null : zoneId);

  return (
    <div className={styles.setorLayout}>
      <img src="/img/setorizacao/setor_base.jpg" alt="" draggable={false} className={styles.setorBuilding} />
      {zoneImg && (
        <img key={zoneImg} src={zoneImg} alt="" draggable={false} className={styles.setorBuildingZone} />
      )}

      <div className={styles.setorOverlay}>
        {ZONAS.map((z) => (
          <div
            key={z.id}
            className={`${styles.setorRow} ${active === z.id ? styles.setorRowActive : ''}`}
            onClick={() => setActive(active === z.id ? null : z.id)}
          >
            <span className={styles.setorRowLabel}>{z.label}</span>
            <span className={styles.setorRowSub}>{z.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Implantação ────────────────────────────────────────────────────────── */
const PAVIMENTOS = [
  {
    id: 'terreo',
    label: 'TÉRREO',
    img: '/img/implantacao/terreo.jpg',
    items: [
      { n: '01', name: 'Bicicletário',    photo: '/img/areas/BICICLETÁRIO.jpg',  tour: 'https://tour.meupasseiovirtual.com/view/OcgdQ12fCSz', x: 40, y: 80 },
      { n: '02', name: 'Delivery',        photo: '/img/areas/Delivery.jpg',      tour: 'https://tour.meupasseiovirtual.com/view/bmtHvLlPz1b', x: 40, y: 68 },
      { n: '03', name: 'Acesso Hall',     photo: '/img/areas/ACESSO.jpg',        tour: 'https://tour.meupasseiovirtual.com/view/cq4XH5RHcXq', x: 40, y: 55 },
      { n: '04', name: 'Portaria',        photo: '/img/areas/HALL01.jpg',        tour: null, x: 40, y: 42 },
      { n: '05', name: 'Hall',            photo: '/img/areas/HALL01.jpg',        tour: 'https://tour.meupasseiovirtual.com/view/ARYQuDq83pr', x: 51, y: 55 },
      { n: '06', name: 'Mini Mercado',    photo: '/img/areas/HALL02.jpg',        tour: 'https://tour.meupasseiovirtual.com/view/d0CqfKE4OCb', x: 57, y: 72 },
      { n: '07', name: 'Espaço Pet',      photo: '/img/areas/PET PLACE.jpg',     tour: 'https://tour.meupasseiovirtual.com/view/Te6JH6iOc1T', x: 63, y: 87 },
      { n: '08', name: 'Coworking',       photo: '/img/areas/COWORKING01.jpg',   tour: 'https://tour.meupasseiovirtual.com/view/uHdU67puwhK', x: 53, y: 24 },
    ],
  },
  {
    id: 'terceiro',
    label: '3º ANDAR',
    img: '/img/implantacao/3 andar.png',
    items: [
      { n: '01', name: 'Lavanderia',            photo: '/img/areas/LAVANDERIA.jpg',    tour: 'https://tour.meupasseiovirtual.com/view/zJiDjaVnvIk', x: 55, y: 35 },
      { n: '02', name: 'Academia',              photo: '/img/areas/FITNESS02.jpg',     tour: 'https://tour.meupasseiovirtual.com/view/Gb6E6CWiCUg', x: 70, y: 72 },
      { n: '03', name: 'Salão de Jogos',        photo: '/img/areas/JOGOS01.jpg',       tour: 'https://tour.meupasseiovirtual.com/view/XZ9AwEitvuP', x: 70, y: 35 },
      { n: '04', name: 'Espaço de Convivência', photo: '/img/areas/JOGOS_EXTERNO.jpg', tour: 'https://tour.meupasseiovirtual.com/view/XZ9AwEitvuP', x: 88, y: 35 },
      { n: '05', name: 'Espaço Fitness Externo',photo: '/img/areas/FITNESS_EXTERNO.jpg',tour: 'https://tour.meupasseiovirtual.com/view/VCs1Kr49hZx', x: 89, y: 82 },
    ],
  },
  {
    id: 'rooftop',
    label: 'ROOFTOP',
    img: '/img/implantacao/rooftop.png',
    items: [
      { n: '01', name: 'Piscina',        photo: '/img/areas/ROOFTOP01.jpg',       tour: 'https://tour.meupasseiovirtual.com/view/FJlQh8lAZxS', x: 25, y: 65 },
      { n: '02', name: 'Solarium',       photo: '/img/areas/ROOFTOP02.jpg',       tour: 'https://tour.meupasseiovirtual.com/view/sBd3hHrIQ8F', x: 15, y: 40 },
      { n: '03', name: 'Sauna',          photo: '/img/areas/SAUNA.jpg',           tour: 'https://tour.meupasseiovirtual.com/view/jGEMSUJstl4', x: 40, y: 82 },
      { n: '04', name: 'Área Gourmet',   photo: '/img/areas/CHURRASQUEIRA01.jpg', tour: 'https://tour.meupasseiovirtual.com/view/CUFDfWuI33A', x: 75, y: 35 },
      { n: '05', name: 'Churrasqueira',  photo: '/img/areas/CHURRASQUEIRA02.jpg', tour: 'https://tour.meupasseiovirtual.com/view/CUFDfWuI33A', x: 94, y: 35 },
      { n: '06', name: 'Salão de Festas',photo: '/img/areas/GOURMET01.jpg',       tour: 'https://tour.meupasseiovirtual.com/view/t59hOj8MM0a', x: 86, y: 72 },
    ],
  },
];

function ImplantacaoView() {
  const [active, setActive] = useState('terreo');
  const [selected, setSelected] = useState(null); // { name, photo }
  const [hoveredItem, setHoveredItem] = useState(null);
  const pav = PAVIMENTOS.find(p => p.id === active);

  const handlePavChange = (id) => { setActive(id); setSelected(null); };
  const handleItemClick = (item) => { if (item.tour || item.photo) setSelected(item); };

  return (
    <div className={styles.implLayout}>

      {/* Imagem de fundo */}
      <img
        className={styles.implBgVideo}
        src="/img/areas/ROOFTOP03.jpg"
        alt=""
        draggable={false}
      />

      {/* Seletor de pavimento */}
      <div className={styles.implSelector}>
        {PAVIMENTOS.map(p => (
          <button
            key={p.id}
            className={`${styles.implSelectorBtn} ${active === p.id ? styles.implSelectorBtnActive : ''}`}
            onClick={() => handlePavChange(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Imagem da planta + hotspots */}
      <div className={styles.implImgArea}>
        <div className={styles.implImgWrap}>
          <img
            key={pav.id}
            src={pav.img}
            alt={`Implantação ${pav.label}`}
            className={styles.implImg}
            draggable={false}
          />
          {pav.items.map(item => (
            <button
              key={item.n}
              className={`${styles.implHotspot} ${(item.tour || item.photo) ? styles.implHotspotClickable : ''} ${hoveredItem === item.n ? styles.implHotspotHovered : ''}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => (item.tour || item.photo) && setSelected(item)}
              onMouseEnter={() => setHoveredItem(item.n)}
              onMouseLeave={() => setHoveredItem(null)}
              aria-label={item.name}
            >
              {item.n}
            </button>
          ))}
        </div>
      </div>

      {/* Legenda com itens numerados */}
      <div className={styles.implLegend}>
        {pav.items.map(item => (
          <div
            key={item.n}
            className={`${styles.implLegendItem} ${(item.tour || item.photo) ? styles.implLegendItemClickable : ''} ${hoveredItem === item.n ? styles.implLegendItemHovered : ''}`}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => setHoveredItem(item.n)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className={`${styles.implLegendNum} ${(item.tour || item.photo) ? styles.implLegendNumActive : ''}`}>{item.n}</span>
            <span className={styles.implLegendName}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Overlay — tour virtual ou imagem */}
      {selected && (
        <div className={styles.implOverlay} onClick={() => setSelected(null)}>
          <div className={styles.implOverlayCard} onClick={e => e.stopPropagation()}>
            <div className={styles.implOverlayHeader}>
              <span className={styles.implOverlayLabel}>{selected.name}</span>
              {selected.tour && <span className={styles.implOverlay360Badge}>⟳ 360°</span>}
              <button className={styles.implOverlayClose} onClick={() => setSelected(null)} aria-label="Fechar">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {selected.tour ? (
              <iframe
                className={styles.implOverlayIframe}
                src={selected.tour}
                referrerPolicy="origin"
                allow="fullscreen *; autoplay *; screen-wake-lock *; geolocation *; accelerometer *; gyroscope *; xr-spatial-tracking *; vr *; web-share *;"
                allowFullScreen
              />
            ) : (
              <img src={selected.photo} alt={selected.name} className={styles.implOverlayImg} draggable={false} />
            )}
          </div>
        </div>
      )}

    </div>
  );
}

/* ── Diferenciais ───────────────────────────────────────────────────────── */
const IconSmart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /><path d="M7 8h10M7 11h6" /></svg>;
const IconPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>;
const IconBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M9 21V5l7-2v18M4 21V10l5-2" /><path d="M11 8h1M11 11h1M11 14h1M11 17h1" /></svg>;
const IconApp = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="17" r="1" /><path d="M9 6h6M9 9h4" /></svg>;
const IconStar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const IconAreas = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;

const FEATURES = [
  { id: '01', Icon: IconSmart, title: 'SMART LIVING', desc: 'Tecnologia e gestão integradas via app Housi — controle total na palma da mão.' },
  { id: '02', Icon: IconPin, title: 'LOCALIZAÇÃO PREMIUM', desc: 'Anália Franco, a 500m da futura estação de metrô e 950m do Shopping.' },
  { id: '03', Icon: IconBuilding, title: 'ARQUITETURA MODERNA', desc: 'Torre contemporânea com fachada exclusiva, varandas amplas e acabamento refinado.' },
  { id: '04', Icon: IconApp, title: 'GESTÃO INTEGRADA', desc: 'IPTU, condomínio e reservas gerenciados pelo app Housi com total transparência.' },
  { id: '05', Icon: IconStar, title: 'EXPERIÊNCIA HOTELEIRA', desc: 'Serviços de hotel com preço de condomínio: limpeza, concierge e muito mais.' },
  { id: '06', Icon: IconAreas, title: 'LAZER COMPLETO', desc: 'Mais de 15 áreas de lazer, coworking, fitness e serviços de conveniência.' },
];

function DiferenciaisView() {
  return (
    <div className={styles.layout}>
      <div className={styles.infoPanel}>
        <h2 className={styles.sectionTitle}>PROJETO</h2>
        <p className={styles.sectionDesc}>
          O Vértice Anália Franco é um empreendimento residencial de alto padrão da
          Zimbel Incorporadora, com gestão Housi — combinando arquitetura contemporânea,
          localização privilegiada e a melhor infraestrutura de serviços da Zona Leste.
        </p>
        <ul className={styles.highlights}>
          <li>Zimbel Incorporadora</li>
          <li>Powered by Housi</li>
          <li>Anália Franco · São Paulo</li>
          <li>Studios e 1 dormitório</li>
          <li>Torre única com lazer completo</li>
        </ul>
      </div>
      <div className={styles.featuresArea}>
        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <div key={f.id} className={styles.card}>
              <div className={styles.cardIcon}><f.Icon /></div>
              <span className={styles.cardNum}>{f.id}</span>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Ficha Técnica ──────────────────────────────────────────────────────── */
const FT_SUBTABS = ['EMPREENDIMENTO', 'UNIDADES', 'LAZER'];

const FT_FLOORS = [
  { label: 'TÉRREO',   items: ['Hall Social', 'Portaria e Acesso', 'Espaço Delivery', 'Bicicletário', 'Pet Place'] },
  { label: '3º ANDAR', items: ['Academia', 'Fitness Externo', 'Salão de Jogos', 'Coworking', 'Lavanderia'] },
  { label: 'ROOFTOP',  items: ['Piscina', 'Solarium', 'Salão de Festas', 'Área Gourmet', 'Churrasqueira', 'Sauna'] },
];

const FT_UNITS = [
  { id: 1, label: 'Unidade 01', area: '32,58', img: '/img/plantas/planta-01.jpg' },
  { id: 2, label: 'Unidade 02', area: '26,71', img: '/img/plantas/planta-02.jpg' },
  { id: 3, label: 'Unidade 03', area: '29,46', img: '/img/plantas/planta-03.jpg' },
  { id: 4, label: 'Unidade 04', area: '39,06', img: '/img/plantas/planta-04.jpg' },
  { id: 5, label: 'Unidade 05', area: '36,33', img: '/img/plantas/planta-05.jpg' },
];

const FT_LAZER = [
  { label: 'Churrasqueira',               tour: 'https://tour.meupasseiovirtual.com/view/CUFDfWuI33A', photo: '/img/areas/CHURRASQUEIRA01.jpg' },
  { label: 'Coworking / Sala de Reunião', tour: null,                                                   photo: '/img/areas/COWORKING01.jpg' },
  { label: 'Espaço Fitness',              tour: 'https://tour.meupasseiovirtual.com/view/Gb6E6CWiCUg', photo: '/img/areas/FITNESS02.jpg' },
  { label: 'Espaço Gourmet',              tour: 'https://tour.meupasseiovirtual.com/view/t59hOj8MM0a', photo: '/img/areas/GOURMET01.jpg' },
  { label: 'Espaço iFood',                tour: null,                                                   photo: '/img/areas/Delivery.jpg' },
  { label: 'Mini Mercado',                tour: null,                                                   photo: '/img/areas/HALL02.jpg' },
  { label: 'Salão de Jogos',              tour: 'https://tour.meupasseiovirtual.com/view/XZ9AwEitvuP', photo: '/img/areas/JOGOS01.jpg' },
  { label: 'Área de Convivência',         tour: 'https://tour.meupasseiovirtual.com/view/XZ9AwEitvuP', photo: '/img/areas/JOGOS_EXTERNO.jpg' },
  { label: 'Lavanderia',                  tour: 'https://tour.meupasseiovirtual.com/view/zJiDjaVnvIk', photo: '/img/areas/LAVANDERIA.jpg' },
  { label: 'Pet Place',                   tour: null,                                                   photo: '/img/areas/PET PLACE.jpg' },
  { label: 'Piscina',                     tour: 'https://tour.meupasseiovirtual.com/view/FJlQh8lAZxS', photo: '/img/areas/ROOFTOP01.jpg' },
  { label: 'Sauna',                       tour: 'https://tour.meupasseiovirtual.com/view/jGEMSUJstl4', photo: '/img/areas/SAUNA.jpg' },
];

function FichaTecnicaView() {
  const [sub, setSub] = useState('EMPREENDIMENTO');
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className={styles.ftPage}>

      {/* Left: background image */}
      <div className={styles.ftLeft}>
        <img src="/img/areas/ROOFTOP03.jpg" alt="" className={styles.ftBg} />
        <div className={styles.ftBgOverlay} />
        <div className={styles.ftBgCaption}>
          <span className={styles.ftBgTitle}>VĒRTICE</span>
          <span className={styles.ftBgSub}>Rua Bruna, 340 · Anália Franco · São Paulo</span>
        </div>
      </div>

      {/* Right: data panel */}
      <div className={styles.ftRight}>
        <nav className={styles.ftSubTabs}>
          {FT_SUBTABS.map(t => (
            <button
              key={t}
              className={`${styles.ftSubTab} ${sub === t ? styles.ftSubTabActive : ''}`}
              onClick={() => setSub(t)}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className={styles.ftContent}>

          {/* EMPREENDIMENTO */}
          {sub === 'EMPREENDIMENTO' && (
            <div>
              <section className={styles.ftSection}>
                <h3 className={styles.ftSectionTitle}>DADOS DO EMPREENDIMENTO</h3>
                <div className={styles.ftRow}>
                  <span className={styles.ftLabel}>Projeto</span>
                  <span className={styles.ftValue}>Vértice Anália Franco</span>
                </div>
                <div className={styles.ftRow}>
                  <span className={styles.ftLabel}>Endereço</span>
                  <span className={styles.ftValue}>Rua Bruna, 340 · São Paulo · SP · CEP 03370-000</span>
                </div>
                <div className={styles.ftRow}>
                  <span className={styles.ftLabel}>Incorporação e Construção</span>
                  <span className={styles.ftValue}>Zimbel Incorporadora</span>
                </div>
              </section>

              <section className={styles.ftSection}>
                <h3 className={styles.ftSectionTitle}>DADOS TÉCNICOS</h3>
                <div className={styles.ftStats}>
                  <div className={styles.ftStat}>
                    <span className={styles.ftStatNum}>71</span>
                    <span className={styles.ftStatLabel}>unidades</span>
                  </div>
                  <div className={styles.ftStat}>
                    <span className={styles.ftStatNum}>12</span>
                    <span className={styles.ftStatLabel}>andares</span>
                  </div>
                  <div className={styles.ftStat}>
                    <span className={styles.ftStatNum}>2</span>
                    <span className={styles.ftStatLabel}>elevadores</span>
                  </div>
                </div>
                <div className={styles.ftRow}>
                  <span className={styles.ftLabel}>Composição</span>
                  <span className={styles.ftValue}>Térreo · 12 Pavimentos Tipo · Rooftop</span>
                </div>
                <div className={styles.ftRow}>
                  <span className={styles.ftLabel}>Tipologias</span>
                  <span className={styles.ftValue}>Studios e Apartamentos de 1 dormitório</span>
                </div>
                <div className={styles.ftRow}>
                  <span className={styles.ftLabel}>Áreas privativas</span>
                  <span className={styles.ftValue}>de 24,17 m² a 54,42 m²</span>
                </div>
              </section>

              <section className={styles.ftSection}>
                <h3 className={styles.ftSectionTitle}>ÁREAS POR PAVIMENTO</h3>
                {FT_FLOORS.map(floor => (
                  <div key={floor.label} className={styles.ftFloorBlock}>
                    <span className={styles.ftFloorLabel}>{floor.label}</span>
                    <ul className={styles.ftFloorList}>
                      {floor.items.map(item => (
                        <li key={item} className={styles.ftFloorItem}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            </div>
          )}

          {/* UNIDADES */}
          {sub === 'UNIDADES' && (
            <div>
              <p className={styles.ftUnidadesNote}>Plantas do Pavimento Térreo · Duplex com Área Descoberta</p>
              <div className={styles.ftUnidades}>
                {FT_UNITS.map(unit => (
                  <button key={unit.id} className={styles.ftUnitCard} onClick={() => setLightbox(unit)}>
                    <img src={unit.img} alt={unit.label} className={styles.ftUnitImg} />
                    <div className={styles.ftUnitInfo}>
                      <span className={styles.ftUnitLabel}>{unit.label}</span>
                      <span className={styles.ftUnitArea}>{unit.area} <em>m²</em></span>
                      <span className={styles.ftUnitHint}>ver planta →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LAZER */}
          {sub === 'LAZER' && (
            <div>
              <div className={styles.ftLazerHeader}>
                <span className={styles.ftLazerCount}>12</span>
                <span className={styles.ftLazerCountLabel}>itens de lazer</span>
              </div>
              <ul className={styles.ftLazerList}>
                {FT_LAZER.map((item, i) => (
                  <li
                    key={item.label}
                    className={styles.ftLazerItem}
                    onClick={() => setLightbox(item)}
                  >
                    <span className={styles.ftLazerNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.ftLazerName}>{item.label}</span>
                    <span className={styles.ftLazerChevron}>
                      {item.tour ? '▶' : '→'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.ftLightboxOverlay} onClick={() => setLightbox(null)}>
          <div
            className={`${styles.ftLightboxInner} ${lightbox.tour ? styles.ftLightboxFull : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.ftLightboxHeader}>
              <span className={styles.ftLightboxTitle}>{lightbox.label}</span>
              {lightbox.area && <span className={styles.ftLightboxArea}>{lightbox.area} m²</span>}
              {lightbox.tour && <span className={styles.ftLightboxTourBadge}>tour virtual</span>}
              <button className={styles.ftLightboxClose} onClick={() => setLightbox(null)} aria-label="Fechar">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {lightbox.img && (
              <img src={lightbox.img} alt={lightbox.label} className={styles.ftLightboxImg} />
            )}
            {!lightbox.img && lightbox.tour && (
              <iframe
                className={styles.ftLightboxIframe}
                src={lightbox.tour}
                referrerPolicy="origin"
                allow="fullscreen *; autoplay *; screen-wake-lock *; geolocation *; accelerometer *; gyroscope *; xr-spatial-tracking *; vr *; web-share *;"
                allowFullScreen
              />
            )}
            {!lightbox.img && !lightbox.tour && lightbox.photo && (
              <img src={lightbox.photo} alt={lightbox.label} className={styles.ftLightboxImg} />
            )}
          </div>
        </div>
      )}

    </div>
  );
}

/* ── Tour Virtual ───────────────────────────────────────────────────────── */
const TOUR_AREAS = [
  { label: 'Piscina',                tour: 'https://tour.meupasseiovirtual.com/view/FJlQh8lAZxS' },
  { label: 'Área Gourmet',           tour: 'https://tour.meupasseiovirtual.com/view/CUFDfWuI33A' },
  { label: 'Churrasqueira',          tour: 'https://tour.meupasseiovirtual.com/view/CUFDfWuI33A' },
  { label: 'Espaço Fitness',         tour: 'https://tour.meupasseiovirtual.com/view/Gb6E6CWiCUg' },
  { label: 'Salão de Jogos',         tour: 'https://tour.meupasseiovirtual.com/view/XZ9AwEitvuP' },
  { label: 'Área de Convivência',    tour: 'https://tour.meupasseiovirtual.com/view/XZ9AwEitvuP' },
  { label: 'Salão de Festas',        tour: 'https://tour.meupasseiovirtual.com/view/t59hOj8MM0a' },
  { label: 'Sauna',                  tour: 'https://tour.meupasseiovirtual.com/view/jGEMSUJstl4' },
  { label: 'Lavanderia',             tour: 'https://tour.meupasseiovirtual.com/view/zJiDjaVnvIk' },
];

function TourVirtualView() {
  const [active, setActive] = useState(TOUR_AREAS[0]);

  return (
    <div className={styles.tourWrapper}>
      <aside className={styles.tourSidebar}>
        <span className={styles.tourSidebarTitle}>Ambientes</span>
        <div className={styles.tourList}>
          {TOUR_AREAS.map((area) => (
            <div
              key={area.label}
              className={`${styles.tourItem} ${active.label === area.label ? styles.tourItemActive : ''}`}
              onClick={() => setActive(area)}
            >
              <span className={styles.tourItemDot} />
              <span className={styles.tourItemName}>{area.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className={styles.tourIframeArea}>
        <iframe
          key={active.tour}
          className={styles.tourIframe}
          src={active.tour}
          title={active.label}
          referrerPolicy="origin"
          allow="fullscreen *; autoplay *; screen-wake-lock *; geolocation *; accelerometer *; gyroscope *; xr-spatial-tracking *; vr *; web-share *;"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/* ── Placeholder genérico ───────────────────────────────────────────────── */
function PlaceholderView({ tab }) {
  return (
    <div className={styles.placeholder}>
      <span className={styles.placeholderLabel}>{tab}</span>
      <small>Conteúdo em breve</small>
    </div>
  );
}

/* ── Fachada Interativa ─────────────────────────────────────────────────── */
function FachadaInterativaView() {
  return (
    <div className={styles.fachadaWrapper}>
      <iframe
        src="https://editor.atta3d.com.br/projetos/vertice/embed"
        title="Experiencia 3D - Vértice Anália Franco"
        style={{ width: '100%', aspectRatio: '16/9', border: 0, display: 'block' }}
        allow="fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

/* ── Módulo principal ───────────────────────────────────────────────────── */
export default function Mod03() {
  return (
    <ModuleLayout tabs={TABS} defaultTab="FICHA TÉCNICA">
      {(activeTab) => {
        if (activeTab === 'FICHA TÉCNICA') return <FichaTecnicaView />;
        if (activeTab === 'SETORIZAÇÃO') return <SetorizacaoView />;
        if (activeTab === 'IMPLANTAÇÃO') return <ImplantacaoView />;
        if (activeTab === 'FACHADA INTERATIVA') return <FachadaInterativaView />;
        if (activeTab === 'ORIENTAÇÃO SOLAR') return <OrientacaoSolarView />;
        if (activeTab === 'TOUR VIRTUAL')    return <TourVirtualView />;
        if (activeTab === 'DIFERENCIAIS')    return <DiferenciaisView />;
        return <PlaceholderView tab={activeTab} />;
      }}
    </ModuleLayout>
  );
}
