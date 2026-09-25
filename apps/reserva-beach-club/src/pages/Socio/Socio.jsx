import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import ScrollHint from '../../components/ScrollHint/ScrollHint';
import styles from './Socio.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TOP_TABS = [
  { id: 'titulo',       label: 'Título' },
  { id: 'patrimonial',  label: 'Sócio Patrimonial' },
  { id: 'comparativo',  label: 'Comparativo' },
  { id: 'categorias',   label: 'Categorias' },
  { id: 'investimento', label: 'Investimento' },
  { id: 'projecao',     label: 'Projeção' },
];

/* ── Dados ──────────────────────────────────────────────────────────────── */
const PATRIMONIAL_ITENS = [
  'Utilização do clube das 06h às 23h;',
  'Titular + cônjuge;',
  '3 filhos de até 30 anos;',
  '4 agregados sêniors (acima de 70 anos);',
  '12 convidados por mês;',
  'Prestador de serviço com entrada livre*',
  'Todas atividades inclusas na mensalidade**',
];

const COMP_PATRIMONIAL = [
  'Aquisição de título patrimonial;',
  'Direito de uso permanente;',
  'Revenda com taxa de 10%;',
  'Valorização do título;',
  'Utilização em horário integral;',
  '12 convidados por mês;',
  'Acesso à todas as modalidades sem custo adicional;',
  'Livre acesso à Piscina de ondas;',
  'Inclusão de agregados sênior;',
  'Construção de patrimônio familiar;',
];

const COMP_MEMBERSHIP = [
  'Contrato de direito de uso;',
  'Não há participação patrimonial;',
  'Uso condicionado à vigência contratual;',
  'Não gera ativo ou possibilidade de revenda;',
  'Não há valorização;',
  'Há regras e limitações contratuais;',
  'Há cobrança individual por convidado;',
  'Pagamento por cada atividade extra;',
  'Depende do plano contratado;',
  'Há cobrança individual de cada agregado;',
  'Em caso de débito - título bloqueado;',
];

const CATEGORIAS = [
  {
    id: 'individual',
    titulo: ['Sócio Patrimonial', 'Individual'],
    itens: [
      'Utilização do clube das 06h às 23h;',
      'Titular;',
      '10 convidados por mês;',
      'Todas atividades inclusas na mensalidade**',
    ],
  },
  {
    id: 'familiar',
    titulo: ['Sócio Patrimonial', 'Familiar'],
    itens: PATRIMONIAL_ITENS,
    notas: true,
  },
  {
    id: 'galacticos',
    titulo: ['GALACTICOS', 'HOUSE'],
    selo: 'Um círculo privado dentro do Reserva',
    itens: [
      'Utilização do clube das 06h às 23h;',
      'Titular + cônjuge;',
      '3 filhos de até 30 anos;',
      '4 agregados sêniors (acima de 70 anos);',
      '20 convidados por mês;',
      'Prestador de serviço com entrada livre*',
      'Atividades exclusivas Galacticos House**',
      'Todas atividades e dependências do Reserva Beach Club inclusas na mensalidade**',
    ],
    notas: true,
  },
];

const CLUBES = [
  { nome: 'Beyond the Club',       inicial: 'R$ 440 mil', atual: 'R$ 1100 mil' },
  { nome: 'São Paulo Surf Club',   inicial: 'R$ 750 mil', atual: 'R$ 990 mil' },
];

const LOTES = [
  { lote: 'Lote 01', tipo: 'Fundador',    valor: 'R$430 MIL',  h: 23,  esgotado: true },
  { lote: 'Lote 02', tipo: 'Fundador',    valor: 'R$450 MIL',  h: 24,  esgotado: true },
  { lote: 'Lote 03', tipo: 'Fundador',    valor: 'R$569 MIL',  h: 32,  esgotado: true },
  { lote: 'Lote 04', tipo: 'Fundador',    valor: 'R$679 MIL',  h: 34,  esgotado: true },
  { lote: 'Lote 01', tipo: 'Patrimonial', valor: 'R$550 MIL',  h: 37,  esgotado: true },
  { lote: 'Lote 02', tipo: 'Patrimonial', valor: 'R$597 MIL',  h: 43,  esgotado: true },
  { lote: 'Lote 03', tipo: 'Patrimonial', valor: 'R$620 MIL',  h: 50,  esgotado: true },
  { lote: 'Lote 04', tipo: 'Patrimonial', valor: 'R$653 MIL',  h: 58 },
  { lote: 'Lote 05', tipo: 'Patrimonial', valor: 'R$734 MIL',  h: 67 },
  { lote: 'Lote 06', tipo: 'Patrimonial', valor: 'R$880 MIL',  h: 81 },
  { lote: 'Lote 07', tipo: 'Spread de valorização', valor: 'R$1.100 MI', h: 100 },
];

const Notas = () => (
  <div className={styles.notas}>
    <span>*Babá, cuidador de idoso, dentre outros;</span>
    <span>**Para mais informações consulte nosso executivo de vendas;</span>
  </div>
);

const Onda = ({ className }) => (
  <svg className={className} viewBox="0 0 130 50" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0 C40 0 70 22 130 22 L130 50 L0 50 Z" fill="#cfe0f7" />
  </svg>
);

/* ── Aba: Formato de Título Associativo ─────────────────────────────────── */
const FITAS = [
  { p0: [40, 100],  c1: [170, 100], c2: [250, 40],  p3: [380, 20] },
  { p0: [40, 260],  c1: [260, 260], c2: [340, 130], p3: [560, 120] },
  { p0: [240, 350], c1: [380, 350], c2: [420, 240], p3: [560, 230] },
];
const FITA_H = 58;

function fitaPath({ p0, c1, c2, p3 }, dx = 0, dy = 0) {
  const pt = ([x, y], oy = 0) => `${x + dx} ${y + dy + oy}`;
  return `M${pt(p0)} C${pt(c1)} ${pt(c2)} ${pt(p3)} L${pt(p3, FITA_H)} C${pt(c2, FITA_H)} ${pt(c1, FITA_H)} ${pt(p0, FITA_H)} Z`;
}

/* posições no palco de 1000×440; as fitas ocupam x 200–800 (viewBox 600×440) */
const TITULO_TEXTOS = [
  { lado: 'esq', pos: { top: 96,  right: 774 }, titulo: 'Formalizado e seguro', texto: 'Estatuto próprio registrado em cartório - estrutura associativa sólida.' },
  { lado: 'esq', pos: { top: 258, right: 774 }, titulo: 'Um ativo com valor real', texto: 'Pode ser comercializado, acompanhando a valorização ao longo do tempo.' },
  { lado: 'esq', pos: { top: 350, right: 574 }, titulo: 'Integração familiar ampliada', texto: 'Ascendentes dos cônjuges acima de 70 anos também podem usufruir do clube, sem custo adicional.' },
  { lado: 'dir', pos: { top: 0,   left: 594 },  titulo: 'Não é timeshare. Nem ativo imobiliário.', texto: 'Sem limitações dos sistemas fracionados ou vínculos com imóveis.' },
  { lado: 'dir', pos: { top: 116, left: 774 },  titulo: 'Vitalício para o associado', texto: 'Acesso contínuo ao clube sem prazo de expiração.' },
  { lado: 'dir', pos: { top: 226, left: 774 },  titulo: 'Familiar por essência', texto: 'O título contempla cônjuges e até 3 filhos (até 30 anos).' },
];

function AbaTitulo() {
  return (
    <div className={`${styles.painel} ${styles.bgNavy}`}>
      <h2 className={styles.tituloCentro}>Formato de Título Associativo</h2>
      <div className={styles.fitasStage}>
        <svg className={styles.fitasSvg} viewBox="0 0 600 440" aria-hidden="true">
          <defs>
            <linearGradient id="ouro" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#7a5418" />
              <stop offset="22%"  stopColor="#c89b45" />
              <stop offset="45%"  stopColor="#f1d68c" />
              <stop offset="62%"  stopColor="#c9a04e" />
              <stop offset="85%"  stopColor="#e9c977" />
              <stop offset="100%" stopColor="#8a6320" />
            </linearGradient>
            <filter id="folha" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="ruido" />
              <feColorMatrix in="ruido" type="saturate" values="0" result="cinza" />
              <feComposite in="cinza" in2="SourceGraphic" operator="in" result="textura" />
              <feBlend in="SourceGraphic" in2="textura" mode="multiply" />
            </filter>
            <filter id="sombra" x="-10%" y="-10%" width="130%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity="0.45" />
            </filter>
          </defs>
          {FITAS.map((f, i) => (
            <g key={i} filter="url(#sombra)">
              <path d={fitaPath(f, 3, 5)} fill="#5a3d10" />
              <path d={fitaPath(f)} fill="url(#ouro)" filter="url(#folha)" />
              <path d={fitaPath(f)} fill="none" stroke="#f7e3a6" strokeOpacity="0.55" strokeWidth="1.2" />
            </g>
          ))}
        </svg>
        {TITULO_TEXTOS.map(t => (
          <div
            key={t.titulo}
            className={`${styles.fitaTexto} ${t.lado === 'esq' ? styles.fitaTextoEsq : ''}`}
            style={t.pos}
          >
            <strong>{t.titulo}</strong>
            <span>{t.texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Aba: Sócio Patrimonial ─────────────────────────────────────────────── */
function AbaPatrimonial() {
  return (
    <div className={`${styles.painel} ${styles.bgAzul} ${styles.duasColunas}`}>
      <div className={styles.textoCorrido}>
        <p>
          O título patrimonial concede ao titular o direito vitalício de acesso e uso das áreas
          e experiências do clube, de acordo com o regulamento interno.
        </p>
        <p>
          Ao adquiri-lo, a pessoa torna-se associada do Reserva Beach Club e passa a integrar
          uma comunidade restrita, conectada por um mesmo estilo de vida.
        </p>
        <p>
          O título é um ativo patrimonial. Isso significa que ele possui valor próprio, pode ser
          transferido ou revendido, respeitando as regras estabelecidas pelo clube. Por isso, é
          tratado também como um investimento em lazer, bem-estar e qualidade de vida.
        </p>
      </div>
      <div className={`${styles.card} ${styles.cardNavy}`}>
        <h2 className={styles.cardTitulo}>Sócio Patrimonial</h2>
        <ul className={styles.lista}>
          {PATRIMONIAL_ITENS.map(t => <li key={t}>{t}</li>)}
        </ul>
        <Notas />
        <Onda className={styles.onda} />
      </div>
    </div>
  );
}

/* ── Aba: Comparativo ───────────────────────────────────────────────────── */
function AbaComparativo() {
  return (
    <div className={`${styles.painel} ${styles.bgAzul} ${styles.duasColunas} ${styles.comparativo}`}>
      <div className={`${styles.card} ${styles.cardNavy}`}>
        <h2 className={styles.cardTitulo}>Sócio Patrimonial</h2>
        <ul className={`${styles.lista} ${styles.listaCompacta}`}>
          {COMP_PATRIMONIAL.map(t => <li key={t}>{t}</li>)}
        </ul>
        <Onda className={styles.onda} />
      </div>
      <div className={`${styles.card} ${styles.cardPreto}`}>
        <h2 className={styles.seloMembership}>Membership</h2>
        <ul className={`${styles.lista} ${styles.listaCompacta} ${styles.listaVermelha}`}>
          {COMP_MEMBERSHIP.map(t => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ── Aba: Categorias ────────────────────────────────────────────────────── */
function AbaCategorias() {
  return (
    <div className={`${styles.painel} ${styles.categorias}`}>
      {CATEGORIAS.map(c => (
        <div key={c.id} className={`${styles.categoria} ${styles[`cat_${c.id}`]}`}>
          <h2 className={styles.catTitulo}>
            <span>{c.titulo[0]}</span>
            <strong>{c.titulo[1]}</strong>
          </h2>
          {c.selo && <span className={styles.catSelo}>{c.selo}</span>}
          <ul className={`${styles.lista} ${styles.catLista}`}>
            {c.itens.map(t => <li key={t}>{t}</li>)}
          </ul>
          {c.notas ? <Notas /> : <div className={styles.notasVazio} />}
        </div>
      ))}
    </div>
  );
}

/* ── Aba: Investimento ──────────────────────────────────────────────────── */
function AbaInvestimento() {
  return (
    <div className={`${styles.painel} ${styles.bgAzul} ${styles.centro}`}>
      <div className={`${styles.card} ${styles.cardNavy} ${styles.cardLargo}`}>
        <h2 className={styles.investTitulo}>
          Um investimento inteligente<br />com <em>valorização garantida</em>
        </h2>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Clubes de luxo de praia de São Paulo</th>
              <th><em>Valor inicial</em></th>
              <th><em>Valor atual</em></th>
            </tr>
          </thead>
          <tbody>
            {CLUBES.map(c => (
              <tr key={c.nome}>
                <td>{c.nome}</td>
                <td><em>{c.inicial}</em></td>
                <td><em>{c.atual}</em></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Reserva Beach Club</strong></td>
              <td><em>R$ 450 mil</em></td>
              <td />
            </tr>
          </tfoot>
        </table>
        <Onda className={styles.onda} />
      </div>
    </div>
  );
}

/* ── Aba: Projeção de Vendas x Preço ────────────────────────────────────── */
function AbaProjecao() {
  const barsRef = useRef(null);

  useEffect(() => {
    // desktop: barras crescem de baixo p/ cima; mobile (barras horizontais): da esquerda p/ direita
    const horizontal = window.innerWidth <= 768;
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.barra}`, {
        ...(horizontal ? { scaleX: 0, transformOrigin: 'left center' } : { scaleY: 0, transformOrigin: 'bottom center' }),
        duration: 0.9, stagger: 0.07, ease: 'power3.out', delay: 0.15,
      });
      gsap.from(`.${styles.esgotado}`, {
        opacity: 0, y: 8, duration: 0.4, stagger: 0.07, delay: 0.7,
      });
    }, barsRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={`${styles.painel} ${styles.bgCreme} ${styles.projecao}`}>
      <div className={styles.projCabecalho}>
        <h2 className={styles.projTitulo}>
          <span>Projeção de</span>
          <strong>Vendas x Preço</strong>
        </h2>
        <p className={styles.projDestaque}>Em 18 meses <strong>valorizou 50%</strong></p>
      </div>
      <span className={styles.chave} aria-hidden="true" />
      <div ref={barsRef} className={styles.grafico}>
        {LOTES.map((l, i) => (
          <div key={i} className={styles.colunaBarra}>
            <div className={styles.areaBarra}>
              <div
                className={`${styles.barra} ${l.tipo === 'Fundador' ? styles.barraFundador : ''}`}
                style={{ '--h': `${l.h}%` }}
              >
                {l.esgotado && <span className={styles.esgotado}>Esgotado</span>}
              </div>
            </div>
            <div className={styles.rotulo}>
              <span>{l.lote}</span>
              <span>{l.tipo}</span>
              <strong>{l.valor}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ABAS = {
  titulo: AbaTitulo,
  patrimonial: AbaPatrimonial,
  comparativo: AbaComparativo,
  categorias: AbaCategorias,
  investimento: AbaInvestimento,
  projecao: AbaProjecao,
};

export default function Socio() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [activeTab, setActiveTab] = useState('titulo');
  const Aba = ABAS[activeTab];

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

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/05" />

      <div className={styles.body}>
        <div key={activeTab} className={styles.abaWrap}>
          <Aba />
        </div>
        <ScrollHint resetKey={activeTab} />
      </div>
    </div>
  );
}
