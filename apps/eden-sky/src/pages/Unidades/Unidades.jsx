import { useState } from 'react';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Unidades.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const iconProps = { viewBox: '0 0 24 24', style: { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } };

const IconBed = () => (
  <svg {...iconProps}><path d="M2 19v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7" /><path d="M2 15h20" /><path d="M6 10V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" /><path d="M2 19v2M22 19v2" /></svg>
);
const IconLavabo = () => (
  <svg {...iconProps}><path d="M4 12h16l-1.2 6.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 12Z" /><path d="M8 12V8a4 4 0 0 1 8 0" /><path d="M12 2v2" /></svg>
);
const IconVaranda = () => (
  <svg {...iconProps}><path d="M4 21V9l8-6 8 6v12" /><path d="M4 21h16" /><path d="M9 21v-6h6v6" /></svg>
);
const IconPiscina = () => (
  <svg {...iconProps}><path d="M2 17c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" /><path d="M2 12c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" /><path d="M6 7V3M12 7V3M18 7V3" /></svg>
);
const IconDuplex = () => (
  <svg {...iconProps}><path d="M4 21V11l8-6 8 6v10" /><path d="M4 21h16" /><path d="M9 21v-5h6v5" /><path d="M4 15h4M16 15h4" /></svg>
);
const IconSocial = () => (
  <svg {...iconProps}><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2 20c.5-3 2.8-5 6-5s5.5 2 6 5" /><path d="M10 20c.5-3 2.8-5 6-5s5.5 2 6 5" /></svg>
);
const IconFlex = () => (
  <svg {...iconProps}><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>
);
const IconLayout = () => (
  <svg {...iconProps}><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 9h18M9 9v11" /></svg>
);

const F = {
  quartos2: { icon: <IconBed />, text: '2 quartos, 1 suíte' },
  quartosRev: { icon: <IconBed />, text: '2 quartos, suíte reversível' },
  suites3: { icon: <IconBed />, text: '3 suítes' },
  suites5: { icon: <IconBed />, text: '5 suítes' },
  lavabo: { icon: <IconLavabo />, text: 'Lavabo' },
  sanitServico: { icon: <IconLavabo />, text: 'Sanit. serviço' },
  varandaGourmet: { icon: <IconVaranda />, text: 'Varanda gourmet' },
  jardim: { icon: <IconVaranda />, text: 'Jardim privativo' },
  piscina: { icon: <IconPiscina />, text: 'Piscina privativa' },
  duplex: { icon: <IconDuplex />, text: 'Unidade duplex' },
  social: { icon: <IconSocial />, text: 'Área social integrada' },
  flex: { icon: <IconFlex />, text: 'Planta flexível' },
  layout: { icon: <IconLayout />, text: 'Sala e cozinha integradas' },
};

// ── Tipo A — sem variação de planta (mesmo pavimento, unidades espelhadas) ──
const TIPO_A = {
  a1: { name: 'Tipologia A1', area: '87,78 m²', units: '10 unidades', img: '/img/unidades/tipo-a.webp', features: [F.quartos2, F.layout, F.social] },
  a2: { name: 'Tipologia A2', area: '94,39 m²', units: '10 unidades', img: '/img/unidades/tipo-a.webp', features: [F.quartosRev, F.flex, F.lavabo] },
};

// ── Tipo B e C — cada um com duas variantes de pavimento ─────────────────────
const TIPO_B = {
  transicao: { name: 'Tipologia B · Transição', area: '176,21 m²', units: '2 unidades', img: '/img/unidades/tipo-b1.webp', features: [F.suites3, F.jardim, F.lavabo, F.sanitServico] },
  padrao: { name: 'Tipologia B', area: '157,95 m²', units: '8 unidades', img: '/img/unidades/tipo-b2.webp', features: [F.suites3, F.social, F.lavabo, F.sanitServico] },
};

const TIPO_C = {
  c1: { name: 'Tipologia C1', area: '175,85 m²', units: '6 unidades', img: '/img/unidades/tipo-c1.webp', features: [F.suites3, F.lavabo, F.sanitServico] },
  c2: { name: 'Tipologia C2', area: '171,66 m²', units: '6 unidades', img: '/img/unidades/tipo-c2.webp', features: [F.suites3, F.varandaGourmet, F.lavabo, F.sanitServico] },
};

// ── Tipo D — duplex, cada variante com pavimento térreo + superior ─────────
const TIPO_D = {
  d1: {
    name: 'Tipologia D1 Duplex', units: '8 unidades', areaTotal: '294,86 m²',
    features: [F.duplex, F.suites5, F.piscina, F.lavabo],
    terreo:   { label: 'Térreo',   area: '173,99 m²', img: '/img/unidades/tipo-d1-terreo.webp' },
    superior: { label: 'Superior', area: '120,87 m²', img: '/img/unidades/tipo-d1-superior.webp' },
  },
  d2: {
    name: 'Tipologia D2 Duplex', units: '2 unidades', areaTotal: '288,62 m²',
    features: [F.duplex, F.suites5, F.piscina, F.lavabo],
    terreo:   { label: 'Térreo',   area: '168,67 m²', img: '/img/unidades/tipo-d2-terreo.webp' },
    superior: { label: 'Superior', area: '119,95 m²', img: '/img/unidades/tipo-d2-superior.webp' },
  },
};

const SPREADS = [
  { id: 'a', label: 'Tipo A' },
  { id: 'bc', label: 'Tipo B e C' },
  { id: 'd', label: 'Duplex' },
];

function FeatureCards({ features }) {
  return (
    <div className={styles.cards}>
      {features.map((f, i) => (
        <div key={i} className={styles.card}>
          <span className={styles.cardIcon}>{f.icon}</span>
          <span className={styles.cardText}>{f.text}</span>
        </div>
      ))}
    </div>
  );
}

function TypologyLabel({ code, area, units }) {
  return (
    <div className={styles.typologyLine}>
      <span className={styles.typologyLabel}>TIPOLOGIA <b>{code}</b> – {area}</span>
      <span className={styles.typologyUnits}>{units}</span>
    </div>
  );
}

function PlanColumn({ eyebrow, unit, pillLabel }) {
  return (
    <div className={styles.column}>
      <figure className={styles.plan}>
        <img src={unit.img} alt={eyebrow} className={styles.planImg} draggable={false} />
        {pillLabel && <span className={styles.pill}>{pillLabel}</span>}
      </figure>
      <div className={styles.columnInfo}>
        <TypologyLabel code={eyebrow} area={unit.area} units={unit.units} />
        <FeatureCards features={unit.features} />
      </div>
    </div>
  );
}

export default function Unidades() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [spreadId, setSpreadId] = useState('a');
  const [bVariant, setBVariant] = useState('padrao');
  const [cVariant, setCVariant] = useState('c1');
  const [dVariant, setDVariant] = useState('d1');

  const spreadIndex = SPREADS.findIndex(s => s.id === spreadId);
  const d = TIPO_D[dVariant];

  return (
    <div className={styles.scene}>

      {/* Top bar */}
      <header className={styles.topBar}>
        <img
          src="/img/logo.webp"
          className={styles.logoSmall}
          alt="Eden Sky"
          draggable={false}
          onClick={() => startTransition('/', '')}
        />
        <nav className={styles.topTabs}>
          <span className={styles.pageTitle}>unidades</span>
        </nav>
        <button className={styles.closeBtn} onClick={openDrawer}>
          <IconClose />
        </button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/05" />

      {/* Corpo — moldura clara com folhagem, no espírito do book de vendas */}
      <div className={styles.body}>
        <div className={styles.page}>

          <img className={styles.leafTop} src="/img/home-leaf-alpha.webp" alt="" draggable={false} />
          <img className={styles.leafBottom} src="/img/home-leaf-alpha.webp" alt="" draggable={false} />

          <div className={styles.pageHead}>
            <h1 className={styles.pageTitleBig}>Plantas</h1>
            <div className={styles.spreadTabs}>
              {SPREADS.map(s => (
                <button
                  key={s.id}
                  className={`${styles.spreadTab} ${spreadId === s.id ? styles.spreadTabActive : ''}`}
                  onClick={() => setSpreadId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {spreadId === 'a' && (
            <div className={styles.spread}>
              <PlanColumn eyebrow="A1" unit={TIPO_A.a1} />
              <PlanColumn eyebrow="A2" unit={TIPO_A.a2} />
            </div>
          )}

          {spreadId === 'bc' && (
            <div className={styles.spread}>
              <div className={styles.columnWrap}>
                <div className={styles.variantToggle}>
                  <button className={bVariant === 'transicao' ? styles.variantActive : ''} onClick={() => setBVariant('transicao')}>Transição</button>
                  <button className={bVariant === 'padrao' ? styles.variantActive : ''} onClick={() => setBVariant('padrao')}>Padrão</button>
                </div>
                <PlanColumn eyebrow="B" unit={TIPO_B[bVariant]} />
              </div>
              <div className={styles.columnWrap}>
                <div className={styles.variantToggle}>
                  <button className={cVariant === 'c1' ? styles.variantActive : ''} onClick={() => setCVariant('c1')}>C1</button>
                  <button className={cVariant === 'c2' ? styles.variantActive : ''} onClick={() => setCVariant('c2')}>C2</button>
                </div>
                <PlanColumn eyebrow="C" unit={TIPO_C[cVariant]} />
              </div>
            </div>
          )}

          {spreadId === 'd' && (
            <>
              <div className={`${styles.variantToggle} ${styles.dToggle}`}>
                <button className={dVariant === 'd1' ? styles.variantActive : ''} onClick={() => setDVariant('d1')}>D1 Duplex</button>
                <button className={dVariant === 'd2' ? styles.variantActive : ''} onClick={() => setDVariant('d2')}>D2 Duplex</button>
              </div>
              <div className={styles.spread}>
                <div className={styles.column}>
                  <figure className={styles.plan}>
                    <img src={d.terreo.img} alt="Térreo" className={styles.planImg} draggable={false} />
                    <span className={styles.pill}>Térreo</span>
                  </figure>
                </div>
                <div className={styles.column}>
                  <figure className={styles.plan}>
                    <img src={d.superior.img} alt="Superior" className={styles.planImg} draggable={false} />
                    <span className={styles.pill}>Superior</span>
                  </figure>
                </div>
                <div className={styles.columnInfo}>
                  <TypologyLabel
                    code={dVariant === 'd1' ? 'D1' : 'D2'}
                    area={`${d.areaTotal} total`}
                    units={`${d.terreo.area} térreo + ${d.superior.area} superior · ${d.units}`}
                  />
                  <FeatureCards features={d.features} />
                </div>
              </div>
            </>
          )}

          <span className={styles.pageBadge}>{spreadIndex + 1}/{SPREADS.length}</span>
        </div>
      </div>

    </div>
  );
}
