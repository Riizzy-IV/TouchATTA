import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTransition } from '@showcase/core';
import ZoomableImage from '../../components/ZoomableImage/ZoomableImage';
import styles from './Localizacao.module.css';

const BRAVIA_LAT = -29.77327;
const BRAVIA_LNG = -50.08878;

const pinIcon = L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:rgba(10,25,44,0.94);
        border:1px solid rgba(159,151,132,0.4);
        padding:8px 14px;
        box-shadow:0 4px 24px rgba(0,0,0,0.5);
        border-radius:3px;
      ">
        <img src="/img/bravia-simbolo-branco.svg" alt="" style="width:22px;height:22px;display:block;" />
      </div>
      <div style="
        width:0;height:0;
        border-left:9px solid transparent;
        border-right:9px solid transparent;
        border-top:9px solid rgba(10,25,44,0.94);
      "></div>
      <div style="
        width:7px;height:7px;border-radius:50%;
        background:#9F9784;margin-top:3px;
        box-shadow:0 0 0 3px rgba(10,25,44,0.5);
      "></div>
    </div>
  `,
  iconSize: [96, 59],
  iconAnchor: [48, 55.5],
});

const GMAPS_EMBED = `https://maps.google.com/maps?q=${BRAVIA_LAT},${BRAVIA_LNG}&z=17&output=embed`;

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TABS = [
  { id: 'mapa', label: 'Mapa' },
  { id: 'regional', label: 'Localização Regional' },
];

export default function Localizacao() {
  const { startTransition } = useTransition();
  const [tab, setTab] = useState('mapa');
  const [useGmaps, setUseGmaps] = useState(false);

  return (
    <div className={styles.scene}>
      <header className={styles.topBar}>
        <img
          src="/img/bravia-logo-branco.svg"
          alt="Brávia"
          className={styles.logo}
          onClick={() => startTransition('/', '')}
        />
        <img
          src="/img/bravia-simbolo-branco.svg"
          alt="Brávia"
          className={styles.logoMark}
          onClick={() => startTransition('/', '')}
        />
        <nav className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button className={styles.closeBtn} onClick={() => startTransition('/', '')}>
          <IconClose />
        </button>
      </header>

      <div className={styles.mapArea}>
        {tab === 'mapa' ? (
          <>
            {useGmaps ? (
              <iframe
                src={GMAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Brávia"
              />
            ) : (
              <MapContainer
                key={`${BRAVIA_LAT},${BRAVIA_LNG}`}
                center={[BRAVIA_LAT, BRAVIA_LNG]}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
                attributionControl={false}
                zoomAnimation={false}
                markerZoomAnimation={false}
                fadeAnimation={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[BRAVIA_LAT, BRAVIA_LNG]} icon={pinIcon} />
              </MapContainer>
            )}

            <button
              className={`${styles.gmapsToggle} ${useGmaps ? styles.gmapsToggleActive : ''}`}
              onClick={() => setUseGmaps(v => !v)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {useGmaps ? 'Mapa padrão' : 'Google Maps'}
            </button>
          </>
        ) : (
          <ZoomableImage src="/img/localizacao-mapa-regional.png" alt="Localização Regional Brávia" />
        )}
      </div>
    </div>
  );
}
