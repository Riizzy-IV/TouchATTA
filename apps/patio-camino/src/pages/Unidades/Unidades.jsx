import { useState } from 'react';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Unidades.module.css';

const TABS = [
  { id: 'tour',     label: 'tour virtual' },
  { id: 'plantas',  label: 'plantas' },
  { id: 'vistas',   label: 'vistas' },
];

const TIPOLOGIAS = [
  {
    id: 'tipo1',
    label: 'Tipo 1',
    area: '45,68 m²',
    items: ['2 quartos, sendo 1 suíte', 'Varanda', 'Sala para 02 ambientes', 'WC social', 'Cozinha integrada ao living', 'Área de serviço'],
  },
  {
    id: 'tipo2',
    label: 'Tipo 2',
    area: '43,53 m²',
    items: ['2 quartos, sendo 1 suíte', 'Varanda', 'Sala para 02 ambientes', 'WC social', 'Cozinha integrada ao living', 'Área de serviço'],
  },
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
          src="/img/camino-logo.png"
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
          <div className={styles.emBreve}>
            <span className={styles.emBreveLabel}>EM BREVE</span>
            <p className={styles.emBreveSubtitle}>TOUR VIRTUAL</p>
          </div>
        )}

        {activeTab === 'plantas' && (
          <div className={styles.plantasWrap}>
            <img src="/img/plantas-tipos.jpg" alt="Plantas dos apartamentos" className={styles.plantasImg} draggable={false} />
            <div className={styles.plantasPanel}>
              {TIPOLOGIAS.map(t => (
                <div key={t.id} className={styles.tipoCard}>
                  <span className={styles.tipoLabel}>Apartamento {t.label}</span>
                  <span className={styles.tipoArea}>{t.area}</span>
                  <ul className={styles.tipoList}>
                    {t.items.map(i => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
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
