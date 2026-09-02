import { useState } from 'react';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import Implantacao from '../../components/Implantacao/Implantacao';
import FachadaInterativa from '../../components/FachadaInterativa/FachadaInterativa';
import styles from './Projeto.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TOP_TABS = [
  { id: 'ficha-tecnica',      label: 'Ficha Técnica' },
  { id: 'implantacao',        label: 'Implantação' },
  { id: 'fachada-interativa', label: 'Fachada Interativa' },
  { id: 'orientacao-solar',   label: 'Orientação Solar' },
  { id: 'diferenciais',       label: 'Diferenciais' },
];

export default function Projeto() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [activeTab, setActiveTab] = useState('ficha-tecnica');

  const tab = TOP_TABS.find(t => t.id === activeTab);

  return (
    <div className={styles.scene}>

      {/* Top bar */}
      <header className={styles.topBar}>
        <img
          src="/img/logo.svg"
          className={styles.logoSmall}
          alt="Eden Sky"
          draggable={false}
          onClick={() => startTransition('/', '')}
        />
        <nav className={styles.topTabs}>
          {TOP_TABS.map(t => (
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

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/03" />

      {/* Corpo */}
      <div className={styles.body}>
        {activeTab === 'implantacao' ? (
          <Implantacao />
        ) : activeTab === 'fachada-interativa' ? (
          <FachadaInterativa />
        ) : (
          <div className={styles.emBreve}>
            <span className={styles.emBreveLabel}>Em breve</span>
            <p className={styles.emBreveSubtitle}>{tab.label}</p>
          </div>
        )}
      </div>

    </div>
  );
}
