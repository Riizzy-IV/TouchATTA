import { useEffect, useRef, useState } from 'react';
import { MdDirectionsBike, MdDirectionsWalk } from 'react-icons/md';
import { LuStore, LuMap, LuGlobe, LuBookOpen } from 'react-icons/lu';
import { gsap } from 'gsap';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Localizacao.module.css';

const SIVER_LAT = -23.5145;
const SIVER_LNG = -47.4724;

const logoPinIcon = L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:rgba(13,36,22,0.93);
        border:1px solid rgba(255,255,255,0.18);
        padding:10px 16px;
        box-shadow:0 4px 24px rgba(0,0,0,0.55);
        border-radius:4px;
      ">
        <img src="/img/logo-branco.avif" alt="Siver Botanique" style="width:90px;height:auto;display:block;" />
      </div>
      <div style="
        width:0;height:0;
        border-left:11px solid transparent;
        border-right:11px solid transparent;
        border-top:11px solid rgba(13,36,22,0.93);
      "></div>
      <div style="
        width:8px;height:8px;border-radius:50%;
        background:#f5f0e8;margin-top:3px;
        box-shadow:0 0 0 3px rgba(13,36,22,0.5);
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
        center={[SIVER_LAT, SIVER_LNG]}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[SIVER_LAT, SIVER_LNG]} icon={logoPinIcon} />
      </MapContainer>
    </div>
  );
}

const IconConveniences = () => <LuStore size={14} />;
const IconMap          = () => <LuMap size={14} />;
const IconLoc360       = () => <LuGlobe size={14} />;
const IconGuide        = () => <LuBookOpen size={14} />;

const IconHome = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconWalk = () => <MdDirectionsWalk size={22} />;
const IconBike = () => <MdDirectionsBike size={22} />;

const PLACES = [
  { id: 1, name: 'Supermercado Atacadão',  category: 'Mercado',     walk: 5,    bike: 2, photo: '/img/fachada.avif' },
  { id: 2, name: 'Padaria Artesanal',       category: 'Alimentação', walk: 3,    bike: 1, photo: '/img/fachada.avif' },
  { id: 3, name: 'Farmácia Pague Menos',    category: 'Saúde',       walk: 4,    bike: 2, photo: '/img/fachada.avif' },
  { id: 4, name: 'Escola Municipal',        category: 'Educação',    walk: 8,    bike: 4, photo: '/img/fachada.avif' },
  { id: 5, name: 'Parque Linear',           category: 'Lazer',       walk: 10,   bike: 5, photo: '/img/fachada.avif' },
  { id: 6, name: 'Shopping Center',         category: 'Shopping',    walk: null, bike: 8, photo: '/img/fachada.avif' },
  { id: 7, name: 'Academia Smart Fit',      category: 'Esporte',     walk: 6,    bike: 3, photo: '/img/fachada.avif' },
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
        <img src="/img/logo.avif" className={styles.logoSmall} draggable={false} onClick={() => startTransition('/', '')} style={{ cursor: 'pointer' }} />
        <nav className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'conveniences' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('conveniences')}><IconConveniences />Conveniências</button>
          <button className={`${styles.tab} ${activeTab === 'map' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('map')}><IconMap />Mapa</button>
          <button className={`${styles.tab} ${activeTab === 'loc360' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('loc360')}><IconLoc360 />Localização 360°</button>
          <button className={`${styles.tab} ${activeTab === 'guide' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('guide')}><IconGuide />Guia de Bairro</button>
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
          <span className={styles.eyebrow}>Av. Cleise Terezinha Rosa da Silva</span>
          <h1 className={styles.title}>
            <span>PERTO</span>
            <span className={styles.titleMid}>DE TUDO,</span>
            <span className={styles.titleFade}>EM MEIO À</span>
            <span>NATUREZA.</span>
          </h1>
          <p className={styles.subtitle}>
            RECREIO DOS SOROCABANOS<br />
            <span>SOROCABA · SP</span>
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
                          <IconBike />
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

      {/* Localização 360° */}
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
