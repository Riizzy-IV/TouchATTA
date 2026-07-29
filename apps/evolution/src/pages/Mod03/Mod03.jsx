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
  { id: 'tipologias',     label: 'Tipologias'     },
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
      { label: 'Vagas',           value: '13 vagas de garagem' },
      { label: 'Área do terreno', value: '475 m²' },
      { label: 'Área construída', value: '2.295,53 m²' },
      { label: 'Tipologias',      value: '2 dormitórios — múltiplas configurações' },
      { label: 'Áreas privativas', value: 'de 34,97 m² a 49,90 m²' },
    ],
  },
  {
    title: 'Por Pavimento',
    items: [
      { label: 'Térreo',       value: 'Hall Social · Portaria · Bicicletário' },
      { label: 'Andares tipo', value: '4 unidades por pavimento' },
      { label: 'Cobertura',    value: 'Área Gourmet · Jacuzzi · Convivência' },
    ],
  },
];

const TIPOLOGIAS = [
  { tipo: 'TIPO 01', desc: '2 Dorms · Varanda Gourmet · Terraço Descoberto', area: '49,90 m²' },
  { tipo: 'TIPO 02', desc: '2 Dorms · Terraço Descoberto',                   area: '46,70 m²' },
  { tipo: 'TIPO 03', desc: '2 Dorms · Terraço Coberto',                      area: '44,50 m²' },
  { tipo: 'TIPO 04', desc: '2 Dorms · Varanda Gourmet',                      area: '42,30 m²' },
  { tipo: 'TIPO 05', desc: '2 Dorms',                                         area: '38,20 m²' },
  { tipo: 'TIPO 06', desc: '2 Dorms',                                         area: '36,80 m²' },
  { tipo: 'TIPO 07', desc: '2 Dorms',                                         area: '35,90 m²' },
  { tipo: 'TIPO 08', desc: '2 Dorms',                                         area: '35,40 m²' },
  { tipo: 'TIPO 09', desc: '2 Dorms',                                         area: '34,97 m²' },
  { tipo: 'TIPO 10', desc: '2 Dorms',                                         area: '34,97 m²' },
];

const LAZER = [
  { n: '01', label: 'Academia'        },
  { n: '02', label: 'Coworking'       },
  { n: '03', label: 'Espaço Pet'      },
  { n: '04', label: 'Pet Care'        },
  { n: '05', label: 'Área Gourmet'    },
  { n: '06', label: 'Jacuzzi'         },
  { n: '07', label: 'Bicicletário'    },
  { n: '08', label: 'Hall de Entrada' },
  { n: '09', label: 'Mini Mercado'    },
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

function TipologiasView() {
  return (
    <div className={styles.tipoRoot}>
      <div className={styles.tipoLeft}>
        <p className={styles.tipoLabel}>TIPOLOGIAS</p>
        <h2 className={styles.tipoTitle}>10 Plantas</h2>
        <p className={styles.tipoRange}>de 34,97 m² até 49,90 m²</p>
        {TIPOLOGIAS.map(t => (
          <div key={t.tipo} className={styles.tipoItem}>
            <div className={styles.tipoDot} />
            <div>
              <span className={styles.tipoTipo}>{t.tipo}</span>
              <span className={styles.tipoDesc}>{t.desc}</span>
            </div>
            <span className={styles.tipoArea}>{t.area}</span>
          </div>
        ))}
        <p className={styles.tipoNote}>* Dados sujeitos a alteração conforme memorial descritivo</p>
      </div>
      <div className={styles.tipoRight}>
        <img src="/img/fachada-1.png" alt="" className={styles.tipoImg} />
        <div className={styles.tipoOverlay}>
          <p className={styles.tipoOverlayText}>Residencial<br /><strong>Evolution</strong></p>
          <p className={styles.tipoOverlaySub}>TATUAPÉ</p>
        </div>
      </div>
    </div>
  );
}

function LazerView() {
  return (
    <div className={styles.lazerRoot}>
      <img src="/img/gourmet-1.png" alt="" className={styles.lazerBg} />
      <div className={styles.lazerOverlay} />
      <div className={styles.lazerContent}>
        <p className={styles.lazerLabel}>ÁREAS DE LAZER</p>
        <h2 className={styles.lazerTitle}>9 Espaços de <em>Bem-viver</em></h2>
        <div className={styles.lazerGrid}>
          {LAZER.map(l => (
            <div key={l.n} className={styles.lazerCard}>
              <span className={styles.lazerNum}>{l.n}</span>
              <span className={styles.lazerName}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
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
        {activeTab === 'tipologias'     && <TipologiasView />}
        {activeTab === 'lazer'          && <LazerView />}
      </div>
    </div>
  );
}
