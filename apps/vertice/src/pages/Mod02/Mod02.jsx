import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import lottie from 'lottie-web';
import clickRaw from '../../assets/click.json';
import ModuleLayout from '../../components/ModuleLayout/ModuleLayout';
import CardCarousel from '../../components/CardCarousel/CardCarousel';
import PanoramicaView from './PanoramicaView';
import styles from './Mod02.module.css';

const IconCarGuia = () => (
  <svg viewBox="0 0 512 512" className={styles.guiaPanelCarIcon}>
    <defs>
      <linearGradient id="guia-car-grad" gradientUnits="userSpaceOnUse" x1="256" x2="256" y1="12.71" y2="487.564">
        <stop offset="0" stopColor="#00efd1"/>
        <stop offset="1" stopColor="#00acea"/>
      </linearGradient>
    </defs>
    <path d="m474.591 226.663-39.219-17.878-34.605-55.165a54.415 54.415 0 0 0 -46.537-25.62h-147.352a55.124 55.124 0 0 0 -43.739 21.493l-44.607 58.485-74.552 20.387a43.578 43.578 0 0 0 -31.98 42.144v28.5c0 24.118 19.164 43.991 43.279 43.991h6.391a55.547 55.547 0 0 0 107.539 0h167.96a55.547 55.547 0 0 0 107.539 0h12.013c24.115 0 43.279-19.873 43.279-43.988v-32.535a43.619 43.619 0 0 0 -25.409-39.814zm-359.152 137.689a35.542 35.542 0 1 1 35.542-35.541 35.582 35.582 0 0 1 -35.542 35.541zm275.5 0a35.542 35.542 0 1 1 35.542-35.541 35.582 35.582 0 0 1 -35.543 35.541zm89.061-65.34c0 13.088-10.192 23.988-23.279 23.988h-10.579a55.535 55.535 0 0 0 -110.408 0h-165.091a55.535 55.535 0 0 0 -110.408 0h-4.956c-13.087 0-23.279-10.9-23.279-23.988v-28.5a23.584 23.584 0 0 1 17.251-22.9l77.934-21.324a9.863 9.863 0 0 0 5.263-3.588l46.63-61.092a34.959 34.959 0 0 1 27.8-13.61h147.352a34.619 34.619 0 0 1 29.644 16.236l36.26 57.8a9.9 9.9 0 0 0 4.336 3.752l41.844 19.1a23.546 23.546 0 0 1 13.686 21.591z" fill="url(#guia-car-grad)"/>
  </svg>
);

function ClickIcon() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: clickRaw,
    });
    return () => anim.destroy();
  }, []);
  return <div ref={ref} className={styles.lottieIcon} />;
}


const TABS = [
  'CONVENIÊNCIAS',
  'PANORÂMICA',
  'MAPA',
  'LOCALIZAÇÃO 360°',
  'GUIA DO BAIRRO',
];

const CONVENIENCES = [
  { id: '01', name: 'ESTAÇÃO ANÁLIA FRANCO', photo: '/img/conveniencia/metro.webp', car: '3 min', walk: '6 min' },
  { id: '02', name: 'SUPERMERCADO NEGREIROS', photo: '/img/conveniencia/Supermecado.avif', car: '3 min', walk: '7 min' },
  { id: '03', name: 'HOSPITAL VITÓRIA', photo: '/img/conveniencia/hospitais-destaque-amil.jpg', car: '5 min', walk: '10 min' },
  { id: '04', name: 'SHOPPING ANÁLIA FRANCO', photo: '/img/conveniencia/shopping-analia-franco-melhor-da-zona-leste.webp', car: '5 min', walk: '12 min' },
  { id: '05', name: 'ACADEMIA SMARTFIT', photo: '/img/conveniencia/smart_fit.jpg', car: '5 min', walk: '12 min' },
  { id: '06', name: 'PARQUE CERET', photo: '/img/conveniencia/ceret.avif', car: '7 min', walk: '17 min' },
  { id: '08', name: 'PADARIA ANÁLIA', photo: '/img/conveniencia/padaria.jpg', car: '3 min', walk: '5 min' },
  { id: '09', name: 'FARMÁCIA ULTRAFARMA', photo: '/img/conveniencia/farmacia.jpg', car: '4 min', walk: '8 min' },
];

const GUIDE_CATEGORIES = [
  {
    id: 'lazer',
    label: 'LAZER',
    items: [
      { name: 'Shopping Anália Franco', min: 5 },
      { name: 'Parque Ceret', min: 7 },
      { name: 'Academia SmartFit', min: 5 },
      { name: 'Parque Linear do Tatuapé', min: 6 },
      { name: 'Ciclovia Radial Leste', min: 4 },
      { name: 'Shopping Metrô Tatuapé', min: 9 },
      { name: 'Arena Corinthians', min: 20 },
    ],
  },
  {
    id: 'mercados',
    label: 'MERCADOS',
    items: [
      { name: 'Supermercado Negreiros', min: 2 },
      { name: 'Pão de Açúcar', min: 4 },
      { name: 'Oba Hortifruti', min: 5 },
      { name: 'Hirota Food', min: 5 },
      { name: 'Feira Livre da Anália', min: 3 },
      { name: 'Carrefour Bairro', min: 6 },
      { name: 'Atacadão Tatuapé', min: 9 },
    ],
  },
  {
    id: 'restaurantes',
    label: 'RESTAURANTES E PADARIAS',
    items: [
      { name: 'Outback Shopping Anália', min: 5 },
      { name: 'NB Steak', min: 5 },
      { name: 'Madero Anália Franco', min: 5 },
      { name: 'Casa de Bolos', min: 4 },
      { name: 'Cheiro Verde', min: 4 },
      { name: 'Forno de Minas', min: 5 },
      { name: 'Padaria Brasileira', min: 3 },
      { name: 'Vivenda do Camarão', min: 6 },
    ],
  },
  {
    id: 'saude',
    label: 'ENSINO E SAÚDE',
    items: [
      { name: 'Hospital Vitória', min: 4 },
      { name: 'Ultrafarma', min: 3 },
      { name: 'Drogasil', min: 2 },
      { name: 'Fleury Diagnósticos', min: 5 },
      { name: 'Hospital São Camilo', min: 8 },
      { name: 'Colégio São Domingos', min: 5 },
      { name: 'UNIP Tatuapé', min: 7 },
    ],
  },
  {
    id: 'comercial',
    label: 'POLOS COMERCIAIS',
    items: [
      { name: 'Av. Conselheiro Carrão', min: 4 },
      { name: 'Rua Tuiuti (comércio)', min: 5 },
      { name: 'Av. Radial Leste', min: 3 },
      { name: 'Polo Empresarial Tatuapé', min: 6 },
      { name: 'Av. Celso Garcia', min: 5 },
      { name: 'Centro Comercial Tatuapé', min: 8 },
    ],
  },
  {
    id: 'mobilidade',
    label: 'MOBILIDADE',
    items: [
      { name: 'Futura Est. Anália Franco (L2)', min: 2 },
      { name: 'Est. Tatuapé (L3 + CPTM 11/12)', min: 6 },
      { name: 'Est. Carrão (CPTM L11)', min: 7 },
      { name: 'Av. Radial Leste', min: 3 },
      { name: 'Marginal Tietê', min: 10 },
      { name: 'Rod. Presidente Dutra', min: 12 },
      { name: 'Aeroporto de Guarulhos', min: 35 },
    ],
  },
];


/* ── Conveniências ──────────────────────────────────────────────────────── */
function ConvenienciasView() {
  return (
    <div className={styles.conveniencias}>
      <video
        className={styles.convBgVideo}
        src="/videos/magnific_anime-a-piscina-com-uma-movimentacao-leve-da-agua-_kling_1080p_16-9_24fps_39180.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.infoPanel}>
        <h2 className={styles.sectionTitle}>ANÁLIA FRANCO</h2>
        <p className={styles.sectionDesc}>
          Um dos bairros mais valorizados de São Paulo, a Anália Franco
          reúne excelente infraestrutura, áreas verdes, shopping,
          transporte público e uma das melhores qualidades de vida
          da Zona Leste.
        </p>
        <ul className={styles.highlights}>
          <li>Futura estação de metrô a 500m</li>
          <li>Shopping Anália Franco a 950m</li>
          <li>Parque Ceret a 1,4 km</li>
          <li>Academia Smartfit a 1 km</li>
          <li>Hospital Vitória a 800m</li>
        </ul>
      </div>
      <div className={styles.carouselArea}>
        <CardCarousel items={CONVENIENCES} />
      </div>
    </div>
  );
}

/* ── Mapa ───────────────────────────────────────────────────────────────── */
const VERTICE_LAT = -23.5687;
const VERTICE_LNG = -46.5599;

const logoPinIcon = L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:rgba(7,24,32,0.93);
        border:1px solid rgba(255,255,255,0.22);
        padding:10px 16px;
        box-shadow:0 4px 24px rgba(0,0,0,0.55);
      ">
        <img src="/img/logo.png" alt="Vértice" style="width:90px;height:auto;display:block;" />
      </div>
      <div style="
        width:0;height:0;
        border-left:11px solid transparent;
        border-right:11px solid transparent;
        border-top:11px solid rgba(7,24,32,0.93);
      "></div>
      <div style="
        width:8px;height:8px;border-radius:50%;
        background:#fff;margin-top:3px;
        box-shadow:0 0 0 3px rgba(7,24,32,0.6);
      "></div>
    </div>
  `,
  iconSize: [122, 92],
  iconAnchor: [61, 92],
});

function MapaView() {
  return (
    <div className={styles.mapaWrapper}>
      <MapContainer
        center={[VERTICE_LAT, VERTICE_LNG]}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[VERTICE_LAT, VERTICE_LNG]} icon={logoPinIcon} />
      </MapContainer>
    </div>
  );
}

/* ── Localização 360° ───────────────────────────────────────────────────── */
function Loc360View() {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(true);

  function handleLoad() {
    setLoaded(true);
    setTimeout(() => setVisible(false), 500);
  }

  return (
    <div className={styles.loc360Wrapper}>
      <iframe
        title="Localização 360° Anália Franco"
        src="https://tour.meupasseiovirtual.com/view/aRH3SqOsnal"
        className={styles.loc360Frame}
        referrerPolicy="origin"
        allowFullScreen
        allow="fullscreen *; autoplay *; screen-wake-lock *; geolocation *; accelerometer *; gyroscope *; xr-spatial-tracking *; vr *; web-share *;"
        onLoad={handleLoad}
      />
      <div className={styles.loc360Overlay}>
        <span className={styles.loc360Label}>ANÁLIA FRANCO · SÃO PAULO</span>
      </div>

      {visible && (
        <div className={`${styles.loc360Preload} ${loaded ? styles.loc360PreloadOut : ''}`}>
          <div className={styles.loc360Spinner} />
          <span className={styles.loc360PreloadLabel}>CARREGANDO</span>
        </div>
      )}
    </div>
  );
}

/* ── Coluna individual com swipe ────────────────────────────────────────── */
function GuiaCol({ cat, isOpen, onOpen, onClose }) {
  const startY = useRef(null);

  const onPointerDown = (e) => {
    startY.current = e.clientY ?? e.touches?.[0]?.clientY;
  };

  const onPointerUp = (e) => {
    if (startY.current === null) return;
    const endY = e.clientY ?? e.changedTouches?.[0]?.clientY;
    const delta = endY - startY.current;
    startY.current = null;

    if (Math.abs(delta) < 8) {
      // tap — toggle
      isOpen ? onClose() : onOpen();
    } else if (delta < -20) {
      // swipe up — abre
      onOpen();
    } else if (delta > 20) {
      // swipe down — fecha
      onClose();
    }
  };

  return (
    <div className={styles.guiaCol}>
      {/* Painel que sobe */}
      <div className={`${styles.guiaPanel} ${isOpen ? styles.guiaPanelOpen : ''}`}>
        <div
          className={styles.guiaPanelHead}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.guiaPanelTitle}>{cat.label}</span>
        </div>
        <ul className={styles.guiaPanelList}>
          {cat.items.map((item, i) => (
            <li key={i} className={styles.guiaPanelItem}>
              <span className={styles.guiaPanelItemName}>{item.name}</span>
              <span className={styles.guiaPanelItemMin}>
                <IconCarGuia />
                {item.min} <small>min</small>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Aba fixa na base */}
      <div
        className={`${styles.guiaTab} ${isOpen ? styles.guiaTabActive : ''}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        role="button"
        tabIndex={0}
      >
        <ClickIcon />
        <span className={styles.guiaTabLabel}>{cat.label}</span>
      </div>
    </div>
  );
}

/* ── Guia do Bairro ─────────────────────────────────────────────────────── */
function GuiaBairroView() {
  const [openIds, setOpenIds] = useState([]);

  const handleOpen = (id) => setOpenIds(prev => prev.includes(id) ? prev : [...prev, id]);
  const handleClose = (id) => setOpenIds(prev => prev.filter(x => x !== id));

  return (
    <div className={styles.guiaWrapper}>

      {/* Background */}
      <img src="/img/areas/ROOFTOP03.jpg" alt="" className={styles.guiaBg} draggable={false} />
      <div className={styles.guiaBgOverlay} />

      {/* Painel da marca — esquerda fixo */}
      <div className={styles.guiaBrand}>
        <div className={styles.guiaBrandBox}>
          <span className={styles.guiaBrandName}>VĒRTICE</span>
          <span className={styles.guiaBrandSub}>ANÁLIA FRANCO</span>
          <span className={styles.guiaBrandTag}>
            PARA VIVER,<br />PARA TRABALHAR,<br />PARA ESTAR.
          </span>
        </div>
      </div>

      {/* Colunas */}
      <div className={styles.guiaCols}>
        {GUIDE_CATEGORIES.map((cat) => (
          <GuiaCol
            key={cat.id}
            cat={cat}
            isOpen={openIds.includes(cat.id)}
            onOpen={() => handleOpen(cat.id)}
            onClose={() => handleClose(cat.id)}
          />
        ))}
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

export default function Mod02() {
  return (
    <ModuleLayout tabs={TABS} defaultTab="CONVENIÊNCIAS">
      {(activeTab) => {
        if (activeTab === 'CONVENIÊNCIAS') return <ConvenienciasView />;
        if (activeTab === 'PANORÂMICA') return <PanoramicaView />;
        if (activeTab === 'MAPA') return <MapaView />;
        if (activeTab === 'LOCALIZAÇÃO 360°') return <Loc360View />;
        if (activeTab === 'GUIA DO BAIRRO') return <GuiaBairroView />;
        return <PlaceholderView tab={activeTab} />;
      }}
    </ModuleLayout>
  );
}
