import { useState, useRef, useCallback } from 'react';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Mod02.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconWalk = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M13.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/>
  </svg>
);

const IconCar = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

const GMAPS_URL = 'https://maps.google.com/maps?q=R.+Prof.+Pedreira+de+Freitas,+848,+Tatu%C3%AEap%C3%A9,+SP&z=16&output=embed';

const PLACES = [
  { id: 1, local: 'Sky Fit Academia',        cat: 'ACADEMIA',    pe: '4',  carro: '2',  photo: null, hue: '#0f2040' },
  { id: 2, local: 'Coco Bambu Tatuapé',      cat: 'GASTRONOMIA', pe: '5',  carro: '2',  photo: null, hue: '#112238' },
  { id: 3, local: 'Hospital São Luiz',       cat: 'SAÚDE',       pe: '6',  carro: '2',  photo: null, hue: '#0d1e35' },
  { id: 4, local: 'Mercado Extra',           cat: 'MERCADO',     pe: '8',  carro: '3',  photo: null, hue: '#102040' },
  { id: 5, local: 'Parque Ceret',            cat: 'LAZER',       pe: '10', carro: '4',  photo: null, hue: '#0e2238' },
  { id: 6, local: 'Metrô Carrão',            cat: 'MOBILIDADE',  pe: '12', carro: '5',  photo: null, hue: '#0c1c36' },
  { id: 7, local: 'Shopping Anália Franco',  cat: 'SHOPPING',    pe: '18', carro: '7',  photo: null, hue: '#111f3a' },
  { id: 8, local: 'Arena Corinthians',       cat: 'ESPORTE',     pe: '25', carro: '10', photo: null, hue: '#0d2040' },
];

const CARD_W   = 300;
const CARD_GAP = 16;

function ConvenienciasView() {
  const stripRef  = useRef(null);
  const dragging  = useRef(false);
  const lastX     = useRef(0);
  const stripX    = useRef(0);
  const velX      = useRef(0);

  const getMinX = useCallback(() => {
    if (!stripRef.current) return 0;
    const cw    = stripRef.current.parentElement?.offsetWidth ?? 600;
    const total = PLACES.length * CARD_W + (PLACES.length - 1) * CARD_GAP;
    return Math.min(0, cw - total);
  }, []);

  const onDown = useCallback((e) => {
    dragging.current = true;
    lastX.current    = e.clientX;
    velX.current     = 0;
    stripRef.current?.setPointerCapture(e.pointerId);
    if (stripRef.current) stripRef.current.style.cursor = 'grabbing';
  }, []);

  const onMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    velX.current  = dx;
    lastX.current = e.clientX;
    const next = Math.max(getMinX(), Math.min(0, stripX.current + dx));
    stripX.current = next;
    if (stripRef.current) stripRef.current.style.transform = `translateX(${next}px)`;
  }, [getMinX]);

  const onUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (stripRef.current) stripRef.current.style.cursor = 'grab';
    const target = Math.max(getMinX(), Math.min(0, stripX.current + velX.current * 4));
    stripX.current = target;
    if (stripRef.current) {
      stripRef.current.style.transition = 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)';
      stripRef.current.style.transform  = `translateX(${target}px)`;
      setTimeout(() => {
        if (stripRef.current) stripRef.current.style.transition = '';
      }, 450);
    }
  }, [getMinX]);

  return (
    <div className={styles.convBody}>
      {/* Left — texto */}
      <div className={styles.convLeft}>
        <span className={styles.convEyebrow}>TATUAPÉ · SÃO PAULO</span>
        <h1 className={styles.convTitle}>
          PERTO<br />
          <span className={styles.convTitleFade}>DE TUDO.</span>
        </h1>
        <p className={styles.convAddr}>R. Prof. Pedreira de Freitas, 848</p>
        <div className={styles.convLegend}>
          <span className={styles.convLegendItem}><IconWalk /> a pé</span>
          <span className={styles.convLegendItem}><IconCar /> de carro</span>
        </div>
      </div>

      {/* Right — strip de cards */}
      <div className={styles.convCardsArea}>
        <div
          ref={stripRef}
          className={styles.convStrip}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          {PLACES.map((p) => (
            <div key={p.id} className={styles.convCard}>
              {/* Foto / placeholder */}
              <div
                className={styles.convCardPhoto}
                style={p.photo
                  ? { backgroundImage: `url(${p.photo})` }
                  : { background: `linear-gradient(160deg, ${p.hue} 0%, #0c1a36 100%)` }
                }
              >
                <span className={styles.convCardCat}>{p.cat}</span>
              </div>

              {/* Footer */}
              <div className={styles.convCardFooter}>
                <span className={styles.convCardName}>{p.local}</span>
                <div className={styles.convCardTimes}>
                  <span className={styles.convCardTime}>
                    <IconWalk />
                    <strong>{p.pe}</strong>
                    <em>min</em>
                  </span>
                  <span className={styles.convCardTimeDivider} />
                  <span className={styles.convCardTime}>
                    <IconCar />
                    <strong>{p.carro}</strong>
                    <em>min</em>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Hint de arraste */}
          <div className={styles.convSwipeHint}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Mod02() {
  const { closeModule } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [activeTab, setActiveTab] = useState('conveniences');

  return (
    <div className={styles.scene}>

      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <img
          src="/img/zimbel-logo.svg"
          alt="Zimbel"
          className={styles.topLogo}
          draggable={false}
          onClick={closeModule}
          style={{ cursor: 'pointer' }}
        />

        <h2 className={styles.topTitle}>Bairro</h2>

        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'conveniences' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('conveniences')}
          >
            Conveniências
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'map' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('map')}
          >
            Mapa
          </button>
        </nav>

        <button className={styles.closeBtn} onClick={openDrawer}>
          <IconClose />
        </button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/02" />

      {/* ── CONVENIÊNCIAS ── */}
      {activeTab === 'conveniences' && <ConvenienciasView />}

      {/* ── MAPA ── */}
      {activeTab === 'map' && (
        <div className={styles.mapaWrapper}>
          <iframe
            src={GMAPS_URL}
            title="Localização Evolution Tatuapé"
            className={styles.mapaFrame}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

    </div>
  );
}
