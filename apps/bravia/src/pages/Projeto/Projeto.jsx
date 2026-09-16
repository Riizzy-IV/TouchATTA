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
  { id: 'implantacao', label: 'Implantação', enabled: false },
  { id: 'vistas', label: 'Vistas', enabled: false },
  { id: 'fachada', label: 'Fachada Interativa', enabled: false },
  { id: 'solar', label: 'Orientação Solar', enabled: false },
  { id: 'tour', label: 'Tour Virtual', enabled: false },
];

const PANEL_TABS = [
  { id: 'empreendimento', label: 'Empreendimento' },
  { id: 'areas', label: 'Áreas' },
  { id: 'zoneamento', label: 'Zoneamento' },
];

const AREAS = [
  { value: '499.344,24 m²', label: 'Área total do empreendimento' },
  { value: '403.923,96 m²', label: 'Área utilizada' },
  { value: '189.081,69 m²', label: 'Área total de lotes' },
  { value: '54.921,40 m²', label: 'Sistema viário' },
  { value: '19.509,09 m²', label: 'Passeios e pavimentos' },
  { value: '101.219,66 m²', label: 'Lagos' },
];

export default function Projeto() {
  const { startTransition } = useTransition();
  const [panelTab, setPanelTab] = useState('empreendimento');

  return (
    <div className={styles.scene}>
      <div className={styles.hero}>
        <img src="/img/projeto-hero.jpg" alt="" className={styles.heroImg} />
      </div>

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
              className={`${styles.tab} ${t.id === 'ficha' ? styles.tabActive : ''}`}
              disabled={!t.enabled}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <button className={styles.closeBtn} onClick={() => startTransition('/', '')}>
          <IconClose />
        </button>
      </header>

      <div className={styles.panel}>
        <nav className={styles.panelTabs}>
          {PANEL_TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.panelTab} ${panelTab === t.id ? styles.panelTabActive : ''}`}
              onClick={() => setPanelTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className={styles.panelBody}>
          {panelTab === 'empreendimento' && (
            <>
              <h3 className={styles.blockTitle}>Dados do empreendimento</h3>

              <p className={styles.fieldLabel}>Projeto</p>
              <p className={styles.fieldValue}>Marina Velas Blancas</p>

              <p className={styles.fieldLabel}>Descrição</p>
              <p className={styles.fieldValue}>Condomínio Horizontal Fechado de Lotes</p>

              <p className={styles.fieldLabel}>Endereço</p>
              <p className={styles.fieldValue}>Estrada RS-407, s/n · Bairro Morro Alto · Maquiné/RS</p>
              <p className={styles.fieldSub}>Matrícula 20.385</p>

              <p className={styles.fieldLabel}>Proprietário e incorporadora</p>
              <p className={styles.fieldValue}>Stier Empreendimentos Imobiliários Ltda</p>
            </>
          )}

          {panelTab === 'areas' && (
            <>
              <h3 className={styles.blockTitle}>Dados técnicos</h3>
              <div className={styles.statsGrid}>
                {AREAS.map(a => (
                  <div key={a.label} className={styles.stat}>
                    <span className={styles.statValue}>{a.value}</span>
                    <span className={styles.statLabel}>{a.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {panelTab === 'zoneamento' && (
            <>
              <h3 className={styles.blockTitle}>Zoneamento</h3>
              <p className={styles.paragraph}>
                A área do empreendimento encontra-se na ZEU — Zona de Expansão Urbana de Maquiné.
                Em referência à Estruturação Espacial do Planejamento, abrange parcialmente a Zona
                Mista 1 — ZM1 (200 m perpendiculares à ERS-407), e Área Predominantemente
                Residencial — APR (a partir de 200 m perpendiculares à ERS-407), onde a atividade
                é aceita.
              </p>
              <p className={styles.paragraph}>
                Fica mantida externa e sem nenhum tipo de intervenção uma parcela nos fundos da
                área a oeste, além de 0,9341 ha destinados à doação para criação de vias
                municipais.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
