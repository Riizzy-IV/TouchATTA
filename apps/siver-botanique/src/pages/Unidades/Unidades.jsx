import { useState } from 'react';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Unidades.module.css';

const TABS = [
  { id: 'tour',     label: 'tour virtual' },
  { id: 'compare',  label: 'compare unidades' },
  { id: 'vistas',   label: 'vistas' },
];

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Unidades() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [activeTab, setActiveTab] = useState('tour');

  return (
    <div className={styles.scene}>

      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <img
          src="/img/logo.avif"
          className={styles.logoSmall}
          draggable={false}
          onClick={() => startTransition('/', '')}
          style={{ cursor: 'pointer' }}
        />
        <nav className={styles.topTabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.topTab} ${activeTab === t.id ? styles.topTabActive : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button className={styles.closeBtn} onClick={openDrawer}>
          <IconClose />
        </button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/05" />

      {/* ── Conteúdo ── */}
      <div className={styles.body}>

        {activeTab === 'tour' && (
          <iframe
            src="https://tour.meupasseiovirtual.com/view/j84YeloeZdi"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            referrerPolicy="origin"
            allow="fullscreen *; autoplay *; screen-wake-lock *; geolocation *; accelerometer *; gyroscope *; xr-spatial-tracking *; vr *; web-share *;"
            allowFullScreen
          />
        )}

        {activeTab === 'compare' && (
          <div className={styles.emBreve}>
            <span className={styles.emBreveLabel}>EM BREVE</span>
            <p className={styles.emBreveSubtitle}>COMPARE UNIDADES</p>
          </div>
        )}

        {activeTab === 'vistas' && (
          <div className={styles.emBreve}>
            <span className={styles.emBreveLabel}>EM BREVE</span>
            <p className={styles.emBreveSubtitle}>VISTAS</p>
          </div>
        )}

      </div>
    </div>
  );
}
