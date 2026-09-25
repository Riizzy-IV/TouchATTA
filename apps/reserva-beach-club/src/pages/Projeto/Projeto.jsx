import { useState } from 'react';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import Implantacao from '../../components/Implantacao/Implantacao';
import OrientacaoSolar from '../../components/OrientacaoSolar/OrientacaoSolar';
import ScrollHint from '../../components/ScrollHint/ScrollHint';
import styles from './Projeto.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AGUA = [
  'Piscina de ondas (tecnologia Surfloch)',
  'Piscina de surf',
  'Piscina coberta',
  'Piscina infantil',
  'Piscina bar aquática',
  'Rio lento',
  'Lounge aquático',
  'Day beds aquáticas',
];

const ESPORTES = [
  'Complexo poliesportivo indoor',
  'Quadras ao ar livre',
  'Quadras de beach tennis',
  'Arena de lutas',
  'Academia',
  'Pista de bike cross',
  'Skate park',
  'Simulador de ski',
];

const GASTRONOMIA = [
  'Restaurantes',
  'Espaço para eventos',
  'Bangalôs',
  'Café, livraria e coworking',
];

const BEM_ESTAR = [
  'Spa & Wellness',
  'Boliche e Game room',
  'Área infantil',
  'Shopping center e módulo de lojas',
  'Tirolesa',
  'Arvorismo',
  'Heliporto',
];

const TOP_TABS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'implantacao', label: 'Implantação' },
  { id: 'solar', label: 'Orientação Solar' },
];

function Bloco({ titulo, children }) {
  return (
    <div className={styles.bloco}>
      <h3 className={styles.blocoTitulo}>{titulo}</h3>
      <div className={styles.blocoTexto}>{children}</div>
    </div>
  );
}

const Linhas = ({ itens }) => itens.map(t => <p key={t}>{t}</p>);

export default function Projeto() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [activeTab, setActiveTab] = useState('sobre');

  return (
    <div className={styles.scene}>
      <header className={styles.topBar}>
        <img
          src="/img/logo.svg"
          className={styles.logoSmall}
          alt="Reserva Beach Club"
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

      <div className={styles.body}>
        {activeTab === 'implantacao' ? <Implantacao /> : activeTab === 'solar' ? <OrientacaoSolar /> : (
        <div className={styles.root}>
          <div className={styles.foto}>
            <img src="/img/galeria/piscina-surf.webp" alt="Reserva Beach Club" className={styles.fotoImg} draggable={false} />
            <span className={styles.fotoBarra} />
          </div>

          <div className={styles.painel}>
            <div className={styles.colunas}>
              <div className={styles.col}>
                <h2 className={styles.titulo}>Sobre</h2>
                <p className={styles.subtitulo}>o RESERVA BEACH CLUB</p>
                <span className={styles.linhaOuro} />

                <Bloco titulo="Conceito">
                  <p>Mais do que um clube, um patrimônio de bem-estar, sofisticação e exclusividade.</p>
                </Bloco>
                <Bloco titulo="Localização">
                  <p>Av. Honório Álvares Penteado</p>
                  <p>Alphaville/Tamboré – São Paulo</p>
                </Bloco>
                <Bloco titulo="Tipo">
                  <p>Clube exclusivo, com títulos patrimoniais de acesso vitalício</p>
                </Bloco>
                <Bloco titulo="Títulos"><p>3.500 títulos familiares (titular + 4 agregados)</p></Bloco>
                <Bloco titulo="Área total"><p>Mais de 169 mil m², com extensa mata nativa preservada</p></Bloco>
              </div>

              <div className={styles.col}>
                <Bloco titulo="Água e Piscinas"><Linhas itens={AGUA} /></Bloco>
                <Bloco titulo="Esportes"><Linhas itens={ESPORTES} /></Bloco>
              </div>

              <div className={styles.col}>
                <Bloco titulo="Gastronomia e Eventos"><Linhas itens={GASTRONOMIA} /></Bloco>
                <Bloco titulo="Bem-estar e Lazer"><Linhas itens={BEM_ESTAR} /></Bloco>
                <Bloco titulo="Tecnologia">
                  <p>Ondas Surfloch, com parceria Siemens: mais de 50 surfistas por hora, para todos os níveis.</p>
                </Bloco>
                <Bloco titulo="Empreendedor"><p>BR Soho Empreendimentos Imobiliários</p></Bloco>
                <Bloco titulo="Construtora"><p>Rocontec</p></Bloco>
                <Bloco titulo="Funcionamento"><p>Todos os dias, das 6h às 23h</p></Bloco>
              </div>
            </div>
          </div>
        </div>
        )}
        <ScrollHint resetKey={activeTab} />
      </div>
    </div>
  );
}
