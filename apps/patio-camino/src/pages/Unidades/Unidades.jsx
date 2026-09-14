import { useState } from 'react';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import Panorama360 from '../../components/Panorama360/Panorama360';
import styles from './Unidades.module.css';

const TABS = [
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

const VISTAS_FLOORS = [
  { id: 'terreo', label: 'TÉRREO', img: '/img/vistas360/terreo.avif' },
  { id: '1',  label: '1°',  img: '/img/vistas360/1.avif' },
  { id: '2',  label: '2°',  img: '/img/vistas360/2.avif' },
  { id: '3',  label: '3°',  img: '/img/vistas360/3.avif' },
  { id: '4',  label: '4°',  img: '/img/vistas360/4.avif' },
  { id: '5',  label: '5°',  img: '/img/vistas360/5.avif' },
  { id: '6',  label: '6°',  img: '/img/vistas360/6.avif' },
  { id: '7',  label: '7°',  img: '/img/vistas360/7.avif' },
  { id: '8',  label: '8°',  img: '/img/vistas360/8.avif' },
  { id: '9',  label: '9°',  img: '/img/vistas360/9.avif' },
  { id: '10', label: '10°', img: '/img/vistas360/10.avif' },
  { id: '11', label: '11°', img: '/img/vistas360/11.avif' },
  { id: '12', label: '12°', img: '/img/vistas360/12.avif' },
  { id: '13', label: '13°', img: '/img/vistas360/13.avif' },
  { id: '14', label: '14°', img: '/img/vistas360/14.avif' },
  { id: '15', label: '15°', img: '/img/vistas360/15.avif' },
  { id: '16', label: '16°', img: '/img/vistas360/16.avif' },
  { id: '17', label: '17°', img: '/img/vistas360/17.avif' },
  { id: '18', label: '18°', img: '/img/vistas360/18.avif' },
  { id: '19', label: '19°', img: '/img/vistas360/19.avif' },
  { id: 'cobertura', label: 'COBERTURA', img: '/img/vistas360/cobertura.avif' },
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
  const [activeTab, setActiveTab] = useState('plantas');
  const [activeFloor, setActiveFloor] = useState(VISTAS_FLOORS[0]);

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
          <div className={styles.vistasWrapper}>
            <div className={styles.vistasFull}>
              <Panorama360 key={activeFloor.id} src={activeFloor.img} />
            </div>

            <aside className={styles.vistasPanel}>
              <span className={styles.vistasTitle}>Escolha o<br />andar</span>
              <div className={styles.vistasList}>
                {VISTAS_FLOORS.map((floor) => (
                  <button
                    key={floor.id}
                    className={`${styles.vistasBtn} ${floor.label.length > 3 ? styles.vistasBtnWide : ''} ${activeFloor.id === floor.id ? styles.vistasBtnActive : ''}`}
                    onClick={() => setActiveFloor(floor)}
                  >
                    {floor.label}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}

      </div>
    </div>
  );
}
