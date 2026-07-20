import { useState } from 'react';
import { useTransition } from '../../context/TransitionContext';
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
  { id: 1,  group: 'TÉRREO', label: 'Unidade 01',   area: '32,58', img: '/img/plantas/planta-01.jpg' },
  { id: 2,  group: 'TÉRREO', label: 'Unidade 02',   area: '26,71', img: '/img/plantas/planta-02.jpg' },
  { id: 3,  group: 'TÉRREO', label: 'Unidade 03',   area: '29,46', img: '/img/plantas/planta-03.jpg' },
  { id: 4,  group: 'TÉRREO', label: 'Unidade 04',   area: '39,05', img: '/img/plantas/planta-04.jpg' },
  { id: 5,  group: 'TÉRREO', label: 'Unidade 05',   area: '36,33', img: '/img/plantas/planta-05.jpg' },
  { id: 6,  group: 'TIPO 2', label: 'Unid. 11/21',  area: '24,17', img: '/img/plantas/planta-06.jpg' },
  { id: 7,  group: 'TIPO 2', label: 'Unid. 12/22',  area: '24,20', img: '/img/plantas/planta-06.jpg' },
  { id: 8,  group: 'TIPO 2', label: 'Unid. 13/23',  area: '24,91', img: '/img/plantas/planta-07.jpg' },
  { id: 9,  group: 'TIPO 2', label: 'Unid. 14/24',  area: '30,35', img: '/img/plantas/planta-07.jpg' },
  { id: 10, group: 'TIPO 2', label: 'Unid. 15/25',  area: '29,31', img: '/img/plantas/planta-08.jpg' },
  { id: 11, group: 'TIPO 2', label: 'Unid. 16/26',  area: '31,15', img: '/img/plantas/planta-08.jpg' },
  { id: 12, group: 'TIPO 2', label: 'Unid. 17/27',  area: '29,10', img: '/img/plantas/planta-09.jpg' },
  { id: 13, group: 'TIPO 2', label: 'Unid. 18/28',  area: '28,85', img: '/img/plantas/planta-09.jpg' },
  { id: 14, group: 'TIPO 2', label: 'Unid. 19/29',  area: '27,50', img: '/img/plantas/planta-10.jpg' },
  { id: 15, group: 'TIPO 3', label: 'Unidade 33',   area: '33,37', img: '/img/plantas/planta-10.jpg' },
  { id: 16, group: 'TIPO 3', label: 'Unidade 34',   area: '33,52', img: '/img/plantas/planta-11.jpg' },
  { id: 17, group: 'TIPO 3', label: 'Unidade 35',   area: '54,42', img: '/img/plantas/planta-11.jpg' },
  { id: 18, group: 'TIPO 4', label: 'Final 1',      area: '35,57', img: '/img/plantas/planta-12.jpg' },
  { id: 19, group: 'TIPO 4', label: 'Final 2',      area: '36,10', img: '/img/plantas/planta-12.jpg' },
  { id: 20, group: 'TIPO 4', label: 'Final 3',      area: '24,72', img: '/img/plantas/planta-13.jpg' },
  { id: 21, group: 'TIPO 4', label: 'Final 4',      area: '26,58', img: '/img/plantas/planta-13.jpg' },
  { id: 22, group: 'TIPO 4', label: 'Final 5',      area: '28,14', img: '/img/plantas/planta-14.jpg' },
];

const UNIT_GROUPS = ['TÉRREO', 'TIPO 2', 'TIPO 3', 'TIPO 4'];

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
                  Plantas de todas as unidades · Térreo, Tipo 2, Tipo 3 e Tipo 4
                </p>
                {UNIT_GROUPS.map(group => (
                  <div key={group} className={styles.unitGroup}>
                    <span className={styles.unitGroupLabel}>{group}</span>
                    <div className={styles.unidades}>
                      {UNITS.filter(u => u.group === group).map(unit => (
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
                ))}
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
