import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import Implantacao from '../../components/Implantacao/Implantacao';
import Diferenciais from '../../components/Diferenciais/Diferenciais';
import styles from './Projeto.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TABS = [
  {
    id: 'empreendimento',
    label: 'Empreendimento',
    sections: [
      {
        title: 'Identificação',
        items: [
          { label: 'Endereço',    value: 'Rua São Mateus, 1179\nIputinga — Recife/PE, 50680-000' },
          { label: 'Construtora', value: 'Carrilho Urban' },
          { label: 'Bairro',      value: 'Iputinga' },
        ],
      },
      {
        title: 'Áreas',
        items: [
          { label: 'Área do terreno', value: '+7.000 m²' },
        ],
      },
    ],
  },
  {
    id: 'unidades',
    label: 'Unidades',
    sections: [
      {
        title: 'Torres',
        items: [
          { label: 'Total de torres', value: '2 torres — Bloco A e Bloco B' },
          { label: 'Pavimentos',      value: '20 pavimentos — 1 térreo + 19 tipo' },
          { label: 'Lojas',           value: 'Fachada ativa com 7 lojas' },
        ],
      },
      {
        title: 'Tipologias',
        items: [
          { label: 'Tipo 1', value: '45,68 m² — 2 quartos sendo 1 suíte, sala 2 ambientes, varanda' },
          { label: 'Tipo 2', value: '43,53 m² — 2 quartos sendo 1 suíte, sala 2 ambientes, varanda' },
        ],
      },
      {
        title: 'Vagas & Circulação',
        items: [
          { label: 'Estacionamento', value: '197 vagas rotativas' },
          { label: 'Elevadores',     value: '3 por torre' },
        ],
      },
    ],
  },
  {
    id: 'lazer',
    label: 'Lazer',
    sections: [
      {
        title: 'Aquático',
        items: [
          { label: 'Piscina adulto',  value: 'Com prainha' },
          { label: 'Piscina infantil', value: 'Área segura para as crianças' },
          { label: 'Deck',            value: 'Espaço de descanso integrado à piscina' },
          { label: 'Apoio de piscina', value: 'Com WC e chuveirão' },
        ],
      },
      {
        title: 'Convivência & Esporte',
        items: [
          { label: 'Espaço Festas',  value: 'Com apoio de copa e WC' },
          { label: 'Brinquedoteca',  value: 'Com piscina de bolinhas' },
          { label: 'Gazebos grill',  value: '02 unidades' },
          { label: 'Praça Piquenique', value: '' },
          { label: 'Parque da Infância', value: 'Com cama elástica e casa da árvore' },
          { label: 'Espaço Kids',    value: ' ' },
          { label: 'Minicampo infantil', value: '' },
          { label: 'Praça de jogos', value: '' },
          { label: 'Redário',        value: ' ' },
        ],
      },
    ],
  },
];

const TOP_TABS = [
  { id: 'ficha-tecnica',        label: 'ficha técnica' },
  { id: 'implantacao',          label: 'implantação' },
  { id: 'fachada-interativa',   label: 'fachada interativa' },
  { id: 'orientacao-solar',     label: 'orientação solar' },
  { id: 'diferenciais',         label: 'diferenciais' },
];

export default function Projeto() {
  const { closeModule, startTransition } = useTransition();
  const [activeTopTab, setActiveTopTab] = useState('ficha-tecnica');
  const [activeTab, setActiveTab] = useState('empreendimento');
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();

  const sceneRef    = useRef(null);
  const panelRef    = useRef(null);
  const tabsRef     = useRef(null);

  useEffect(() => {
    if (activeTopTab !== 'ficha-tecnica') return;
    if (!panelRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl
        .fromTo(panelRef.current,
          { x: 120, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.65 })
        .fromTo(
          tabsRef.current ? Array.from(tabsRef.current.children) : [],
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          '-=0.35'
        );
    }, sceneRef);
    return () => ctx.revert();
  }, [activeTopTab]);

  const tab = TABS.find(t => t.id === activeTab);

  return (
    <div className={styles.scene} ref={sceneRef}>

      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <img src="/img/camino-logo.png" className={styles.logoSmall} draggable={false} onClick={() => startTransition('/', '')} style={{ cursor: 'pointer' }} />
        <nav className={styles.topTabs}>
          {TOP_TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.topTab} ${activeTopTab === t.id ? styles.topTabActive : ''}`}
              onClick={() => setActiveTopTab(t.id)}
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

      {/* ── Área abaixo do menu ── */}
      <div className={styles.body}>

        {activeTopTab === 'ficha-tecnica' ? (
          <>
          <div className={styles.bgImage} />
          <div className={styles.panel} ref={panelRef}>
            <div className={styles.tabsRow} ref={tabsRef}>
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className={styles.panelContent}>
              {tab.sections.map(sec => (
                <div key={sec.title} className={styles.section}>
                  <h2 className={styles.sectionTitle}>{sec.title}</h2>
                  {sec.items.map(item => (
                    <div key={item.label} className={styles.item}>
                      <span className={styles.itemLabel}>{item.label}</span>
                      <span className={styles.itemValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          </>
        ) : activeTopTab === 'orientacao-solar' ? (
          <div className={styles.emBreve}>
            <span className={styles.emBreveLabel}>EM BREVE</span>
            <p className={styles.emBreveSubtitle}>ORIENTAÇÃO SOLAR</p>
          </div>
        ) : activeTopTab === 'fachada-interativa' ? (
          <div className={styles.emBreve}>
            <span className={styles.emBreveLabel}>EM BREVE</span>
            <p className={styles.emBreveSubtitle}>FACHADA INTERATIVA</p>
          </div>
        ) : activeTopTab === 'implantacao' ? (
          <Implantacao />
        ) : activeTopTab === 'diferenciais' ? (
          <Diferenciais />
        ) : (
          <div className={styles.emBreve}>
            <span className={styles.emBreveLabel}>EM BREVE</span>
            <p className={styles.emBreveSubtitle}>
              {TOP_TABS.find(t => t.id === activeTopTab)?.label.toUpperCase()}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
