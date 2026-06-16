import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
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
          { label: 'Endereço',           value: 'Av. Cleise Terezinha Rosa da Silva\nRecreo dos Sorocabanos — Sorocaba/SP' },
          { label: 'Incorporação',       value: 'Siver Sorocaba VIII e IX SPE\nDesenvolvimento Imobiliário Ltda.' },
          { label: 'Construção',         value: 'Sivercon Construtora Ltda.' },
          { label: 'Agente Financiador', value: 'Caixa Econômica Federal' },
          { label: 'Programa',           value: 'Minha Casa Minha Vida' },
          { label: 'Estrutura',          value: 'Alvenaria estrutural' },
        ],
      },
      {
        title: 'Áreas',
        items: [
          { label: 'Área do terreno',  value: '6.000,00 m²' },
          { label: 'Área construída',  value: '19.974,60 m²' },
          { label: 'Área de lazer',    value: '1.080,66 m²' },
          { label: 'Área permeável',   value: '1.500,76 m²' },
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
          { label: 'Total de torres',   value: '2 torres' },
          { label: 'Torre A',           value: 'Araucária — 134 apartamentos' },
          { label: 'Torre B',           value: 'Aroeira — 142 apartamentos' },
          { label: 'Total residencial', value: '276 apartamentos' },
          { label: 'Lojas',             value: '4 lojas (Torre A, via pública)' },
        ],
      },
      {
        title: 'Tipologias',
        items: [
          { label: 'Tipo',    value: '264 unidades — 2 dorms, sala integrada, varanda' },
          { label: 'Garden',  value: '8 unidades — quintal gramado privativo' },
          { label: 'Terraço', value: '4 unidades — área externa sobre laje' },
        ],
      },
      {
        title: 'Vagas & Circulação',
        items: [
          { label: 'Vagas residenciais', value: '276 vagas (cobertas ou descobertas)' },
          { label: 'Vagas PNE',          value: '8 vagas (inclusas no total)' },
          { label: 'Vagas lojas',        value: '8 vagas descobertas exclusivas' },
          { label: 'Motos',              value: '14 vagas' },
          { label: 'Bicicletas',         value: '7 vagas' },
          { label: 'Elevadores',         value: '3 por torre (2 sociais + 1 serviço)\n+ 1 no edifício garagem' },
        ],
      },
    ],
  },
  {
    id: 'lazer',
    label: 'Lazer',
    sections: [
      {
        title: 'Área de Lazer',
        items: [
          { label: 'Área total de lazer', value: '1.080,66 m²' },
        ],
      },
      {
        title: 'Aquático',
        items: [
          { label: 'Piscina adulto',   value: 'Fim de semana em família sem sair de casa' },
          { label: 'Piscina infantil', value: 'Diversão segura para as crianças' },
          { label: 'Deck molhado',     value: 'Área de convivência junto à piscina' },
          { label: 'Deck seco',        value: 'Espaço de descanso integrado ao lazer' },
        ],
      },
      {
        title: 'Convivência & Esporte',
        items: [
          { label: 'Salão de festas',  value: 'Espaço para celebrar sem sair do condomínio' },
          { label: 'Espaço gourmet',   value: 'Para receber com conforto e praticidade' },
          { label: 'Playground',       value: 'Área de brinquedos para crianças' },
          { label: 'Academia',         value: 'Saúde e bem-estar dentro do condomínio' },
          { label: 'Quadra esportiva', value: 'Para praticar esportes com a família' },
          { label: 'Espaço pet',       value: 'Área exclusiva para pets' },
        ],
      },
    ],
  },
];

const TOP_TABS = [
  { id: 'ficha-tecnica',        label: 'ficha técnica' },
  { id: 'implantacao',          label: 'implantação' },
  { id: 'fachada-interativa',   label: 'fachada interativa' },
  { id: 'desmonte-isometrico',  label: 'desmonte isométrico' },
  { id: 'orientacao-solar',     label: 'orientação solar' },
  { id: 'tour-virtual',         label: 'tour virtual' },
  { id: 'diferenciais',         label: 'diferenciais' },
];

export default function Projeto() {
  const { closeModule } = useTransition();
  const [activeTopTab, setActiveTopTab] = useState('ficha-tecnica');
  const [activeTab, setActiveTab] = useState('empreendimento');
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();

  const sceneRef    = useRef(null);
  const panelRef    = useRef(null);
  const tabsRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl
        .fromTo(panelRef.current,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          tabsRef.current ? Array.from(tabsRef.current.children) : [],
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          '-=0.3'
        );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const tab = TABS.find(t => t.id === activeTab);

  return (
    <div className={styles.scene} ref={sceneRef}>

      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <img src="/img/logo.png" className={styles.logoSmall} draggable={false} />
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

        <div className={styles.bgImage} />

        {activeTopTab === 'ficha-tecnica' ? (
          <div className={styles.panel} ref={panelRef}>
            <img src="/videos/05 Guidance.gif" className={styles.lottieCorner} draggable={false} />
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
