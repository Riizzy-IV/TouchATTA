import { useState } from 'react';
import { useTransition } from '@showcase/core';
import styles from './Projeto.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TOP_TABS = [
  { id: 'ficha', label: 'Ficha Técnica', enabled: true },
  { id: 'implantacao', label: 'Implantação', enabled: true },
  { id: 'interativo', label: 'Interativo', enabled: true },
];

const EMBED_3D = 'https://editor.atta3d.com.br/projetos/bravia-marina-e-beach-club/embed?embedMode=inline';

const AREAS = [
  { value: '499.344,24 m²', label: 'Área total do empreendimento' },
  { value: '403.923,96 m²', label: 'Área utilizada' },
  { value: '189.081,69 m²', label: 'Área total de lotes' },
  { value: '54.921,40 m²', label: 'Sistema viário' },
  { value: '19.509,09 m²', label: 'Passeios e pavimentos' },
  { value: '101.219,66 m²', label: 'Lagos' },
];

const LEGEND = [
  'Pórtico de acesso ao condomínio',
  'Market Place',
  'Estacionamento',
  'Pub-Gourmet da Praia',
  'Club House',
  'Piscina Adulto',
  'Piscina Infantil',
  'Praia',
  'Atracadouro',
  'Quadra de Beach Tênis',
  'Quadra de futvôlei',
  'Quadra de futebol 7',
  'Quiosque Gourmet',
  'Quadra poliesportiva',
  'Quadra de tênis rápida',
  'Quadra de tênis coberta',
  'Quadra de padel',
  'Playground',
  'Fireplace e Parrilla',
  'Quadra de Pickleball',
  'Quadra de beach tennis coberta',
  'Quadra de padel coberta',
  'Kids Arena',
  'Cachorródromo',
  'Cancha de bocha',
  'Vertiporto e área de recharge de veículos',
  'Heliponto',
  'Chimarródromo',
  'Pomar',
  'Passarela',
  'Acesso de Serviços',
];

export default function Projeto() {
  const { startTransition } = useTransition();
  const [topTab, setTopTab] = useState('ficha');
  const isInterativo = topTab === 'interativo';
  const isFicha = topTab === 'ficha';

  return (
    <div className={styles.scene}>
      {!isInterativo && !isFicha && (
        <div className={`${styles.hero} ${topTab === 'implantacao' ? styles.heroWithPanel : ''}`}>
          <img
            src={topTab === 'implantacao' ? '/img/bravia-implantacao.jpg' : '/img/projeto-hero.jpg'}
            alt=""
            className={`${styles.heroImg} ${topTab === 'implantacao' ? styles.heroImgContain : ''}`}
          />
        </div>
      )}

      <header className={styles.topBar}>
        <div className={styles.brand} onClick={() => startTransition('/', '')}>
          <img src="/img/bravia-simbolo-branco.svg" alt="" className={styles.brandMark} />
          <span className={styles.brandWord}>BRÁVIA</span>
        </div>

        <div className={styles.divider} />

        <nav className={styles.tabs}>
          {TOP_TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${t.id === topTab ? styles.tabActive : ''}`}
              disabled={!t.enabled}
              onClick={() => t.enabled && setTopTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <button className={styles.closeBtn} onClick={() => startTransition('/', '')}>
          <IconClose />
        </button>
      </header>

      {isInterativo ? (
        <div className={styles.embed}>
          <iframe
            src={EMBED_3D}
            title="Experiencia 3D - BRAVIA Marina e Beach Club"
            className={styles.embedFrame}
            allow="fullscreen *; autoplay *; screen-wake-lock *; geolocation *; accelerometer *; gyroscope *; xr-spatial-tracking *; vr *; web-share *;"
            allowFullScreen
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            loading="lazy"
          />
        </div>
      ) : topTab === 'implantacao' ? (
        <div className={styles.panel}>
          <div className={styles.panelBody}>
            <h3 className={styles.blockTitle}>Legenda</h3>
            <ol className={styles.legendList}>
              {LEGEND.map((item, i) => (
                <li key={item} className={styles.legendItem}>
                  <span className={styles.legendNum}>{i + 1}</span>
                  <span className={styles.legendLabel}>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
      <div className={styles.sobreRoot}>
        <div className={styles.sobreFoto}>
          <img src="/img/projeto-hero.jpg" alt="" className={styles.sobreFotoImg} draggable={false} />
          <span className={styles.sobreFotoBarra} />
        </div>

        <div className={styles.sobrePainel}>
          <div className={styles.sobreColunas}>
            <div className={styles.sobreCol}>
              <h2 className={styles.sobreTitulo}>Sobre</h2>
              <p className={styles.sobreSubtitulo}>o BRAVIA MARINA</p>
              <span className={styles.sobreLinha} />

              <div className={styles.bloco}>
                <h3 className={styles.blocoTitulo}>Projeto</h3>
                <p className={styles.blocoTexto}>Bravia Marina &amp; Beach Club</p>
              </div>
              <div className={styles.bloco}>
                <h3 className={styles.blocoTitulo}>Descrição</h3>
                <p className={styles.blocoTexto}>Condomínio Horizontal Fechado de Lotes</p>
              </div>
              <div className={styles.bloco}>
                <h3 className={styles.blocoTitulo}>Endereço</h3>
                <p className={styles.blocoTexto}>Estrada RS-407, s/n · Bairro Morro Alto · Maquiné/RS</p>
                <p className={styles.blocoTextoSub}>Matrícula 20.385</p>
              </div>
              <div className={styles.bloco}>
                <h3 className={styles.blocoTitulo}>Proprietário e Incorporadora</h3>
                <p className={styles.blocoTexto}>Amis incorporadora e urbanizadora</p>
              </div>
            </div>

            <div className={styles.sobreCol}>
              <div className={styles.bloco}>
                <h3 className={styles.blocoTitulo}>Dados Técnicos</h3>
                {AREAS.map(a => (
                  <p key={a.label} className={styles.blocoTexto}>
                    <b>{a.value}</b> — {a.label}
                  </p>
                ))}
              </div>
            </div>

            <div className={styles.sobreCol}>
              <div className={styles.bloco}>
                <h3 className={styles.blocoTitulo}>Zoneamento</h3>
                <p className={styles.blocoTexto}>
                  A área do empreendimento encontra-se na ZEU — Zona de Expansão Urbana de Maquiné.
                  Em referência à Estruturação Espacial do Planejamento, abrange parcialmente a Zona
                  Mista 1 — ZM1 (200 m perpendiculares à ERS-407), e Área Predominantemente
                  Residencial — APR (a partir de 200 m perpendiculares à ERS-407), onde a atividade
                  é aceita.
                </p>
                <p className={styles.blocoTexto}>
                  Fica mantida externa e sem nenhum tipo de intervenção uma parcela nos fundos da
                  área a oeste, além de 0,9341 ha destinados à doação para criação de vias
                  municipais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
