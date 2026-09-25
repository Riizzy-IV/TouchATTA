import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Localizacao.module.css';

// 23°26'44.6"S 46°50'10.2"W
const RBC_LAT = -23.445722;
const RBC_LNG = -46.836167;

const logoPinIcon = L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:#141412;
        padding:10px 14px;
        box-shadow:0 4px 24px rgba(0,0,0,0.35);
        border-radius:4px;
      ">
        <img src="/img/logo.svg" alt="Reserva Beach Club" style="width:44px;height:auto;display:block;" />
      </div>
      <div style="
        width:0;height:0;
        border-left:11px solid transparent;
        border-right:11px solid transparent;
        border-top:11px solid #141412;
      "></div>
      <div style="
        width:8px;height:8px;border-radius:50%;
        background:#6F96D1;margin-top:3px;
        box-shadow:0 0 0 3px rgba(255,255,255,0.7);
      "></div>
    </div>
  `,
  iconSize: [90, 78],
  iconAnchor: [45, 78],
});

const GMAPS_EMBED = `https://maps.google.com/maps?q=${RBC_LAT},${RBC_LNG}&z=15&t=h&output=embed`;

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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
          title="Localização Reserva Beach Club"
        />
      ) : (
        <MapContainer
          center={[RBC_LAT, RBC_LNG]}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[RBC_LAT, RBC_LNG]} icon={logoPinIcon} />
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

export default function Localizacao() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, []);

  return (
    <div className={styles.scene}>
      <div className={styles.content} ref={contentRef}>

        <header className={styles.topBar}>
          <img
            src="/img/logo.svg"
            className={styles.logoSmall}
            alt="Reserva Beach Club"
            draggable={false}
            onClick={() => startTransition('/', '')}
          />
          <nav className={styles.topTabs}>
            <span className={styles.pageTitle}>localização</span>
          </nav>
          <button className={styles.closeBtn} onClick={openDrawer}>
            <IconClose />
          </button>
        </header>

        <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/02" />

        <div className={styles.body}>
          <MapaView />
        </div>

      </div>
    </div>
  );
}
