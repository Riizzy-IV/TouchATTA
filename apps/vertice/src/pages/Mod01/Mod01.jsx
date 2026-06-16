import { useState } from 'react';
import { useTransition } from '@showcase/core';
import styles from './Mod01.module.css';

const TABS = ['EMPREENDIMENTO', 'UNIDADES', 'LAZER'];

const FLOORS = [
  {
    label: 'TÉRREO',
    items: ['Hall Social', 'Portaria e Acesso', 'Espaço Delivery', 'Bicicletário', 'Pet Place'],
  },
  {
    label: '3º ANDAR',
    items: ['Academia', 'Fitness Externo', 'Salão de Jogos', 'Coworking', 'Lavanderia'],
  },
  {
    label: 'ROOFTOP',
    items: ['Piscina', 'Solarium', 'Salão de Festas', 'Área Gourmet', 'Churrasqueira', 'Sauna'],
  },
];

const UNITS = [
  { id: 1, label: 'Unidade 01', area: '32,58', img: '/img/plantas/planta-01.jpg' },
  { id: 2, label: 'Unidade 02', area: '26,71', img: '/img/plantas/planta-02.jpg' },
  { id: 3, label: 'Unidade 03', area: '29,46', img: '/img/plantas/planta-03.jpg' },
  { id: 4, label: 'Unidade 04', area: '39,06', img: '/img/plantas/planta-04.jpg' },
  { id: 5, label: 'Unidade 05', area: '36,33', img: '/img/plantas/planta-05.jpg' },
];

const LAZER = [
  'Churrasqueira',
  'Coworking / Sala de Reunião',
  'Espaço Fitness',
  'Espaço Gourmet',
  'Espaço iFood',
  'Mini Mercado',
  'Salão de Jogos',
  'Área de Convivência',
  'Lavanderia',
  'Pet Place',
  'Piscina',
  'Sauna',
];

export default function Mod01() {
  const { closeModule } = useTransition();
  const [activeTab, setActiveTab] = useState('EMPREENDIMENTO');
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.brand} onClick={closeModule} style={{ cursor: 'pointer' }}>
          <span className={styles.brandName}>VĒRTICE</span>
          <span className={styles.brandSub}>ANÁLIA FRANCO</span>
        </div>

        <div className={styles.badge}>
          <span className={styles.badgeText}>ficha técnica</span>
        </div>

        <button className={styles.closeBtn} onClick={closeModule} aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <div className={styles.main}>

        {/* Left: background image */}
        <div className={styles.leftPanel}>
          <img src="/img/areas/ROOFTOP03.jpg" alt="" className={styles.bgImage} />
          <div className={styles.bgOverlay} />
          <div className={styles.bgCaption}>
            <span className={styles.bgCaptionTitle}>VĒRTICE</span>
            <span className={styles.bgCaptionSub}>Rua Bruna, 340 · Anália Franco · São Paulo</span>
          </div>
        </div>

        {/* Right: data panel */}
        <div className={styles.rightPanel}>
          <nav className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className={styles.content}>

            {/* ── EMPREENDIMENTO ──────────────────────────────────── */}
            {activeTab === 'EMPREENDIMENTO' && (
              <div>
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>DADOS DO EMPREENDIMENTO</h3>
                  <div className={styles.row}>
                    <span className={styles.label}>Projeto</span>
                    <span className={styles.value}>Vértice Anália Franco</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Endereço</span>
                    <span className={styles.value}>Rua Bruna, 340 · São Paulo · SP · CEP 03370-000</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Incorporação e Construção</span>
                    <span className={styles.value}>Zimbel Incorporadora</span>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>DADOS TÉCNICOS</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.stat}>
                      <span className={styles.statNum}>71</span>
                      <span className={styles.statLabel}>unidades</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statNum}>12</span>
                      <span className={styles.statLabel}>andares</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statNum}>2</span>
                      <span className={styles.statLabel}>elevadores</span>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Composição</span>
                    <span className={styles.value}>Térreo · 12 Pavimentos Tipo · Rooftop</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Tipologias</span>
                    <span className={styles.value}>Studios e Apartamentos de 1 dormitório</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Áreas privativas</span>
                    <span className={styles.value}>de 24,17 m² a 54,42 m²</span>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>ÁREAS POR PAVIMENTO</h3>
                  {FLOORS.map(floor => (
                    <div key={floor.label} className={styles.floorBlock}>
                      <span className={styles.floorLabel}>{floor.label}</span>
                      <ul className={styles.floorList}>
                        {floor.items.map(item => (
                          <li key={item} className={styles.floorItem}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              </div>
            )}

            {/* ── UNIDADES ────────────────────────────────────────── */}
            {activeTab === 'UNIDADES' && (
              <div>
                <p className={styles.unidadesNote}>
                  Plantas do Pavimento Térreo · Duplex com Área Descoberta
                </p>
                <div className={styles.unidades}>
                  {UNITS.map(unit => (
                    <button
                      key={unit.id}
                      className={styles.unitCard}
                      onClick={() => setLightbox(unit)}
                    >
                      <img src={unit.img} alt={unit.label} className={styles.unitImg} />
                      <div className={styles.unitInfo}>
                        <span className={styles.unitLabel}>{unit.label}</span>
                        <span className={styles.unitArea}>{unit.area} <em>m²</em></span>
                        <span className={styles.unitHint}>ver planta →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── LAZER ───────────────────────────────────────────── */}
            {activeTab === 'LAZER' && (
              <div>
                <div className={styles.lazerHeader}>
                  <span className={styles.lazerCount}>12</span>
                  <span className={styles.lazerCountLabel}>itens de lazer</span>
                </div>
                <ul className={styles.lazerList}>
                  {LAZER.map((item, i) => (
                    <li key={item} className={styles.lazerItem}>
                      <span className={styles.lazerNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.lazerName}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────── */}
      {lightbox && (
        <div className={styles.lightboxOverlay} onClick={() => setLightbox(null)}>
          <div className={styles.lightboxInner} onClick={e => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <span className={styles.lightboxTitle}>{lightbox.label}</span>
              <span className={styles.lightboxArea}>{lightbox.area} m²</span>
              <button className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Fechar">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <img src={lightbox.img} alt={lightbox.label} className={styles.lightboxImg} />
          </div>
        </div>
      )}

    </div>
  );
}
