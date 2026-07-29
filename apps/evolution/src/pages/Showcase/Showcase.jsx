import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import styles from './Showcase.module.css';

/* ── Data ──────────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'hero' },
  { id: 'ficha' },
  { id: 'localizacao' },
  { id: 'lazer' },
  { id: 'tipologias' },
];

const AMENITIES = [
  { icon: '🏋️', label: 'Academia' },
  { icon: '💻', label: 'Coworking' },
  { icon: '🐾', label: 'Espaço Pet' },
  { icon: '✂️', label: 'Pet Care' },
  { icon: '🍽️', label: 'Área Gourmet' },
  { icon: '♨️', label: 'Jacuzzi' },
  { icon: '🚲', label: 'Bicicletário' },
  { icon: '🏛️', label: 'Hall de Entrada' },
  { icon: '🛒', label: 'Mini Mercado' },
];

const PROXIMIDADE = [
  { tempo: '2 min', local: 'Sky Fit Academia' },
  { tempo: '2 min', local: 'Coco Bambu' },
  { tempo: '2 min', local: 'Hospital São Luiz' },
  { tempo: '5 min', local: 'Parque Ceret' },
  { tempo: '8 min', local: 'Shopping Anália Franco' },
];

const TIPOLOGIAS = [
  '2 Dorms · Varanda Gourmet · Terraço Descoberto',
  '2 Dorms · Terraço Descoberto',
  '2 Dorms · Terraço Coberto',
  '2 Dorms · Varanda Gourmet',
  '2 Dorms',
];

/* ── Sections ──────────────────────────────────────────────────────────── */
function SectionHero() {
  return (
    <div className={styles.hero}>
      <img src="/img/fachada-1.png" alt="Evolution" className={styles.heroImg} />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <p className={styles.heroSub}>Residencial</p>
        <h1 className={styles.heroTitle}>Evolution</h1>
        <p className={styles.heroBairro}>Tatuapé</p>
        <div className={styles.heroDivider} />
        <p className={styles.heroAddr}>R. Prof. Pedreira de Freitas, 848 · Tatuapé, SP</p>
      </div>
    </div>
  );
}

function SectionFicha() {
  const stats = [
    { valor: '40', label: 'Unidades' },
    { valor: '9',  label: 'Pavimentos' },
    { valor: '13', label: 'Vagas' },
    { valor: '475', label: 'M² Terreno', small: true },
  ];
  return (
    <div className={styles.ficha}>
      <div className={styles.fichaLeft}>
        <p className={styles.sectionLabel}>FICHA TÉCNICA</p>
        <h2 className={styles.fichaTitle}>O espaço que você<br />merece viver.</h2>
        <div className={styles.fichaStats}>
          {stats.map(s => (
            <div key={s.label} className={styles.fichaStat}>
              <span className={styles.fichaVal}>{s.valor}<span className={styles.fichaUnit}>{s.small ? 'm²' : ''}</span></span>
              <span className={styles.fichaLabel}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.fichaExtra}>
          <div>
            <span className={styles.fichaExtraVal}>2.295,53 m²</span>
            <span className={styles.fichaExtraLabel}>Área Construída</span>
          </div>
          <div>
            <span className={styles.fichaExtraVal}>Áreas Externas</span>
            <span className={styles.fichaExtraLabel}>Privativas</span>
          </div>
        </div>
      </div>
      <div className={styles.fichaRight}>
        <img src="/img/gourmet-1.png" alt="Gourmet" className={styles.fichaImg} />
        <div className={styles.fichaImgLabel}>Área Gourmet</div>
      </div>
    </div>
  );
}

function SectionLocalizacao() {
  return (
    <div className={styles.localizacao}>
      <div className={styles.locLeft}>
        <img src="/img/fachada-2.png" alt="Fachada Evolution" className={styles.locImg} />
        <div className={styles.locAddr}>R. Prof. Pedreira de Freitas, 848 · Tatuapé</div>
      </div>
      <div className={styles.locRight}>
        <p className={styles.sectionLabel}>LOCALIZAÇÃO</p>
        <h2 className={styles.locTitle}>Privilegiada</h2>
        <div className={styles.locList}>
          {PROXIMIDADE.map(p => (
            <div key={p.local} className={styles.locItem}>
              <span className={styles.locTempo}>{p.tempo}</span>
              <span className={styles.locLocal}>{p.local}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionLazer() {
  return (
    <div className={styles.lazer}>
      <div className={styles.lazerHeader}>
        <p className={styles.sectionLabel}>ÁREAS COMUNS</p>
        <h2 className={styles.lazerTitle}>Lazer & Conforto</h2>
        <p className={styles.lazerSub}>Infraestrutura completa para seu dia a dia</p>
      </div>
      <div className={styles.lazerGrid}>
        {AMENITIES.map(a => (
          <div key={a.label} className={styles.lazerItem}>
            <span className={styles.lazerIcon}>{a.icon}</span>
            <span className={styles.lazerLabel}>{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTipologias() {
  return (
    <div className={styles.tipologias}>
      <div className={styles.tipoLeft}>
        <p className={styles.sectionLabel}>APARTAMENTOS</p>
        <h2 className={styles.tipoTitle}>10 Plantas</h2>
        <p className={styles.tipoRange}>de 34,97 m² até 49,90 m²</p>
        <div className={styles.tipoList}>
          {TIPOLOGIAS.map((t, i) => (
            <div key={i} className={styles.tipoItem}>
              <div className={styles.tipoDot} />
              <span>{t}</span>
            </div>
          ))}
        </div>
        <div className={styles.tipoNote}>
          Apartamentos com área privativa · 2 dormitórios
        </div>
      </div>
      <div className={styles.tipoRight}>
        <div className={styles.tipoImgStack}>
          <img src="/img/fachada-1.png" alt="Fachada" className={styles.tipoImg} />
          <div className={styles.tipoImgOverlay}>
            <p className={styles.tipoImgLabel}>Residencial<br /><strong>Evolution</strong><br />Tatuapé</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SECTION_COMPONENTS = [SectionHero, SectionFicha, SectionLocalizacao, SectionLazer, SectionTipologias];

/* ── Main ──────────────────────────────────────────────────────────────── */
export default function Showcase() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef(null);
  const slideRef = useRef(null);

  const goTo = useCallback((next) => {
    if (animating || next === current) return;
    const dir = next > current ? 1 : -1;
    setAnimating(true);

    gsap.to(slideRef.current, {
      opacity: 0,
      x: dir * -60,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        setCurrent(next);
        gsap.fromTo(slideRef.current,
          { opacity: 0, x: dir * 60 },
          { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out',
            onComplete: () => setAnimating(false) }
        );
      },
    });
  }, [current, animating]);

  const prev = useCallback(() => goTo(Math.max(0, current - 1)), [goTo, current]);
  const next = useCallback(() => goTo(Math.min(SECTIONS.length - 1, current + 1)), [goTo, current]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const SectionComp = SECTION_COMPONENTS[current];

  return (
    <div ref={containerRef} className={styles.root}>
      {/* Slide content */}
      <div ref={slideRef} className={styles.slide}>
        <SectionComp />
      </div>

      {/* Nav arrows */}
      {current > 0 && (
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Anterior">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {current < SECTIONS.length - 1 && (
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Próximo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      <div className={styles.dots}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Seção ${i + 1}`}
          />
        ))}
      </div>

      {/* Zimbel watermark */}
      <div className={styles.watermark}>
        <img src="/img/zimbel-logo.svg" alt="Zimbel" className={styles.watermarkLogo} />
      </div>
    </div>
  );
}
