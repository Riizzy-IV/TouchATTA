import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Mod03.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Data ───────────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'empreendimento', label: 'Empreendimento' },
  { id: 'lazer',          label: 'Lazer'          },
];

const EMPREENDIMENTO = [
  {
    title: 'Identificação',
    items: [
      { label: 'Projeto',       value: 'Residencial Evolution Tatuapé' },
      { label: 'Endereço',      value: 'R. Prof. Pedreira de Freitas, 848 · Tatuapé · São Paulo · SP' },
      { label: 'Incorporadora', value: 'Zimbel Incorporadora' },
    ],
  },
  {
    title: 'Dados Técnicos',
    items: [
      { label: 'Unidades',        value: '40 unidades' },
      { label: 'Pavimentos',      value: '9 pavimentos' },
      { label: 'Vagas',           value: '14 vagas de garagem' },
      { label: 'Área do terreno', value: '475 m²' },
      { label: 'Área construída', value: '2.295,53 m²' },
      { label: 'Tipologias',      value: '2 dormitórios — múltiplas configurações' },
      { label: 'Áreas privativas', value: 'de 34,97 m² a 49,90 m²' },
    ],
  },
  {
    title: 'Por Pavimento',
    items: [
      { label: 'Térreo',          value: 'Hall · Bicicletário · Pet Place · Pet Care · Mini Mercado · Coworking · Jacuzzi · Academia · Salão de Festas · Churrasqueira' },
      { label: 'Andares tipo',    value: '4 unidades por pavimento' },
    ],
  },
];

const LAZER = [
  { n: '01', label: 'Academia',        image: '/img/areas/academia.webp' },
  { n: '02', label: 'Coworking',       image: '/img/areas/coworking.webp' },
  { n: '03', label: 'Espaço Pet',      image: '/img/areas/espaco-pet.webp' },
  { n: '04', label: 'Pet Care',        image: '/img/areas/pet-care.webp' },
  { n: '05', label: 'Área Gourmet',    image: '/img/areas/area-gourmet.webp' },
  { n: '06', label: 'Jacuzzi',         image: '/img/areas/jacuzzi.webp' },
  { n: '07', label: 'Bicicletário',    image: '/img/areas/bicicletario.webp' },
  { n: '08', label: 'Hall de Entrada', image: '/img/areas/hall-entrada.webp' },
  { n: '09', label: 'Mini Mercado',    image: '/img/areas/mini-mercado.webp' },
];

/* ── Views ──────────────────────────────────────────────────────────────── */
function EmpreendimentoView() {
  const panelRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(panelRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.empRoot}>
      <img src="/img/fachada-2.png" alt="" className={styles.empBg} />
      <div className={styles.empPanel} ref={panelRef}>
        {EMPREENDIMENTO.map(sec => (
          <section key={sec.title} className={styles.section}>
            <h3 className={styles.sectionTitle}>{sec.title}</h3>
            {sec.items.map(it => (
              <div key={it.label} className={styles.row}>
                <span className={styles.rowLabel}>{it.label}</span>
                <span className={styles.rowValue}>{it.value}</span>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

function LazerView() {
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.lazerRoot}>
      <img src="/img/gourmet-1.png" alt="" className={styles.lazerBg} />
      <div className={styles.lazerOverlay} />
      <div className={styles.lazerContent}>
        <p className={styles.lazerLabel}>ÁREAS DE LAZER</p>
        <h2 className={styles.lazerTitle}>9 Espaços de <em>Bem-viver</em></h2>
        <div className={styles.lazerGrid}>
          {LAZER.map(l => (
            <button key={l.n} className={styles.lazerCard} onClick={() => setSelected(l)}>
              <span className={styles.lazerNum}>{l.n}</span>
              <span className={styles.lazerName}>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className={styles.lazerLightbox} onClick={() => setSelected(null)}>
          <div className={styles.lazerLightboxCard} onClick={e => e.stopPropagation()}>
            {selected.image ? (
              <img src={selected.image} alt={selected.label} className={styles.lazerLightboxImg} />
            ) : (
              <div className={styles.lazerLightboxEmpty}>
                <span>IMAGEM EM BREVE</span>
              </div>
            )}
            <div className={styles.lazerLightboxHeader}>
              <span className={styles.lazerLightboxLabel}>{selected.label}</span>
              <button className={styles.lazerLightboxClose} onClick={() => setSelected(null)}>
                <IconClose />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Module ─────────────────────────────────────────────────────────────── */
export default function Mod03() {
  const { closeModule } = useTransition();
  const [activeTab, setActiveTab] = useState('empreendimento');
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();

  return (
    <div className={styles.scene}>

      <header className={styles.topBar}>
        <img src="/img/zimbel-logo.svg" alt="Zimbel" className={styles.topLogo} draggable={false} onClick={closeModule} style={{ cursor: 'pointer' }} />
        <div className={styles.topDivider} />
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
        <button className={styles.closeBtn} onClick={openDrawer}><IconClose /></button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/03" />

      <div className={styles.body}>
        {activeTab === 'empreendimento' && <EmpreendimentoView />}
        {activeTab === 'lazer'          && <LazerView />}
      </div>
    </div>
  );
}
