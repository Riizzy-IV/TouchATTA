import { useEffect, useRef, useState } from 'react';
import { MdDirectionsCar, MdDirectionsWalk } from 'react-icons/md';
import { gsap } from 'gsap';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Localizacao.module.css';

const CAMINO_LAT = -8.0305147;
const CAMINO_LNG = -34.9346285;

const logoPinIcon = L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:rgba(29,26,22,0.93);
        border:1px solid rgba(196,154,90,0.35);
        padding:10px 16px;
        box-shadow:0 4px 24px rgba(0,0,0,0.55);
        border-radius:4px;
      ">
        <img src="/img/camino-logo.png" alt="Pátio Camino" style="width:100px;height:auto;display:block;filter:brightness(0) invert(1);" />
      </div>
      <div style="
        width:0;height:0;
        border-left:11px solid transparent;
        border-right:11px solid transparent;
        border-top:11px solid rgba(29,26,22,0.93);
      "></div>
      <div style="
        width:8px;height:8px;border-radius:50%;
        background:#c49a5a;margin-top:3px;
        box-shadow:0 0 0 3px rgba(29,26,22,0.5);
      "></div>
    </div>
  `,
  iconSize: [132, 92],
  iconAnchor: [66, 92],
});

const GMAPS_EMBED = `https://maps.google.com/maps?q=${CAMINO_LAT},${CAMINO_LNG}&z=16&output=embed`;

function MapaView() {
  const [useGmaps, setUseGmaps] = useState(false);

  return (
    <div className={styles.mapaWrapper}>
      {useGmaps ? (
        <iframe
          src={GMAPS_EMBED}
          width="100%"
          height="100%"
          style={{ border: 'none', display: 'block' }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Pátio Camino"
        />
      ) : (
        <MapContainer
          key={`${CAMINO_LAT},${CAMINO_LNG}`}
          center={[CAMINO_LAT, CAMINO_LNG]}
          zoom={16}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          attributionControl={false}
          zoomAnimation={false}
          markerZoomAnimation={false}
          fadeAnimation={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[CAMINO_LAT, CAMINO_LNG]} icon={logoPinIcon} />
        </MapContainer>
      )}

      <button
        className={`${styles.gmapsToggle} ${useGmaps ? styles.gmapsToggleActive : ''}`}
        onClick={() => setUseGmaps(v => !v)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        {useGmaps ? 'Mapa padrão' : 'Google Maps'}
      </button>
    </div>
  );
}

const IconWalk = () => <MdDirectionsWalk size={22} />;

const PLACES = [
  { id: 1, name: 'Selfit Academias Caxangá', category: 'Academia',   bike: 5,  photo: '/img/poi-selfit.jpg' },
  { id: 2, name: 'UFPE',                     category: 'Educação',   bike: 6,  photo: '/img/poi-ufpe.jpg' },
  { id: 3, name: 'Mix Mateus',               category: 'Mercado',    bike: 6,  photo: '/img/poi-mixmateus.jpg' },
  { id: 4, name: 'Plaza Shopping',           category: 'Shopping',   bike: 9,  photo: '/img/poi-plazashopping.jpg' },
  { id: 5, name: 'Novo Atacarejo Várzea',    category: 'Mercado',    bike: 11, photo: '/img/poi-novoatacarejo.jpg' },
  { id: 6, name: 'Terminal Caxangá',         category: 'Mobilidade', bike: 14, photo: '/img/poi-caxanga.jpg' },
];

const CARD_W   = 460;
const CARD_GAP = 20;

export default function Localizacao() {
  const { closeModule, startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [activeTab, setActiveTab] = useState('conveniences');

  const sceneRef  = useRef(null);
  const topBarRef = useRef(null);
  const textRef   = useRef(null);
  const stripRef     = useRef(null);
  const cardRefs     = useRef([]);
  const swipeHintRef = useRef(null);

  const dragging = useRef(false);
  const lastX    = useRef(0);
  const stripX   = useRef(0);
  const velX     = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl
        .fromTo(topBarRef.current,
          { y: -70, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 })
        .fromTo(
          textRef.current ? Array.from(textRef.current.children) : [],
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, stagger: 0.1 },
          '-=0.25'
        )
        .fromTo(
          cardRefs.current.filter(Boolean),
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.07 },
          '-=0.4'
        )
        .fromTo(
          swipeHintRef.current,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' },
          '-=0.1'
        );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const getMinX = () => {
    if (!stripRef.current) return 0;
    const cw    = stripRef.current.parentElement?.offsetWidth ?? 580;
    const total = PLACES.length * CARD_W + (PLACES.length - 1) * CARD_GAP;
    return Math.min(0, cw - total);
  };

  const onDown = (e) => {
    dragging.current = true;
    lastX.current    = e.clientX;
    velX.current     = 0;
    stripRef.current?.setPointerCapture(e.pointerId);
    gsap.killTweensOf(stripRef.current);
  };

  const onMove = (e) => {
    if (!dragging.current) return;
    const dx       = e.clientX - lastX.current;
    velX.current   = dx;
    lastX.current  = e.clientX;
    const next     = Math.max(getMinX(), Math.min(0, stripX.current + dx));
    stripX.current = next;
    gsap.set(stripRef.current, { x: next });
  };

  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const target = Math.max(getMinX(), Math.min(0, stripX.current + velX.current * 5));
    gsap.to(stripRef.current, {
      x: target, duration: 0.55, ease: 'power3.out',
      onUpdate: () => { stripX.current = gsap.getProperty(stripRef.current, 'x'); },
    });
  };

  return (
    <div className={`${styles.scene}${activeTab === 'conveniences' ? ` ${styles.sceneConveniences}` : ''}`} ref={sceneRef}>

      {/* ── Top bar ── */}
      <header className={styles.topBar} ref={topBarRef}>
        <img src="/img/camino-logo.png" className={styles.logoSmall} draggable={false} onClick={() => startTransition('/', '')} style={{ cursor: 'pointer' }} />
        <nav className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'conveniences' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('conveniences')}>conveniências</button>
          <button className={`${styles.tab} ${activeTab === 'map' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('map')}>mapa</button>
          <button className={`${styles.tab} ${activeTab === 'loc360' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('loc360')}>localização 360°</button>
          <button className={`${styles.tab} ${activeTab === 'guide' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('guide')}>guia de bairro</button>
        </nav>
        <button className={styles.closeBtn} onClick={openDrawer}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/02" />

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* Texto — lado esquerdo */}
        <div className={styles.textBlock} ref={textRef} style={activeTab !== 'conveniences' ? { visibility: 'hidden' } : {}}>
          <span className={styles.eyebrow}>R. São Mateus, 1179 · Iputinga</span>
          <h1 className={styles.title}>
            <span>CAMINHOS</span>
            <span className={styles.titleMid}>QUE TE LEVAM</span>
            <span className={styles.titleFade}>AO</span>
            <span>ESSENCIAL.</span>
          </h1>
          <p className={styles.subtitle}>
            IPUTINGA<br />
            <span>RECIFE · PE</span>
          </p>
        </div>

        {/* Cards */}
        {activeTab === 'conveniences' && (
          <div className={styles.cardsArea}>
            <div
              className={styles.strip}
              ref={stripRef}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
            >
              {PLACES.map((p, i) => {
                const isFirst = i === 0;
                return (
                  <div
                    key={p.id}
                    className={styles.card}
                    style={{ zIndex: i + 1 }}
                    ref={el => (cardRefs.current[i] = el)}
                  >
                    {/* Foto full bleed */}
                    <div
                      className={styles.cardPhoto}
                      style={p.photo
                        ? { backgroundImage: `url(${p.photo})` }
                        : { background: p.color }}
                    />

                    {/* Sidebar vertical esquerda */}
                    <div className={styles.cardSidebar}>
                      <div className={styles.sidebarDists}>
                        <div className={styles.sidebarDist}>
                          <MdDirectionsCar size={20} />
                          <b>{p.bike}</b>
                          <span>min</span>
                        </div>
                        {p.walk != null && (
                          <div className={styles.sidebarDist}>
                            <IconWalk />
                            <b>{p.walk}</b>
                            <span>min</span>
                          </div>
                        )}
                      </div>
                      <span className={styles.sidebarName}>{p.name}</span>
                    </div>

                  </div>
                );
              })}


              {/* Swipe hint — dentro do strip, move junto com os cards */}
              <div className={styles.swipeHint} ref={swipeHintRef}>
                <img src="/img/swipe-helper3.gif" alt="" draggable={false} />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mapa — filho direto do scene para cobrir topBar também */}
      {activeTab === 'map' && <MapaView />}

      {/* Localização 360° — aguardando tour do Pátio Camino */}
      {activeTab === 'loc360' && (
        <div className={styles.emBreve}>
          <span className={styles.emBreveLabel}>EM BREVE</span>
          <p className={styles.emBreveSubtitle}>LOCALIZAÇÃO 360°</p>
        </div>
      )}

      {/* Guia de Bairro */}
      {activeTab === 'guide' && (
        <div className={styles.emBreve}>
          <span className={styles.emBreveLabel}>EM BREVE</span>
          <p className={styles.emBreveSubtitle}>GUIA DE BAIRRO</p>
        </div>
      )}
    </div>
  );
}
