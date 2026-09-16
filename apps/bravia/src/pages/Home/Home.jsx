import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavButton from '../../components/NavButton/NavButton';
import styles from './Home.module.css';

const IconLocalizacao = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor', stroke: 'none' }}>
    <path d="M256,93.297c-14.021,0-27.516,4.218-39.025,12.198c-3.402,2.359-4.262,7.05-1.921,10.478c2.342,3.428,6.998,4.294,10.4,1.936c9.004-6.243,19.566-9.543,30.546-9.543c29.754,0,53.96,24.388,53.96,54.365c0,29.977-24.206,54.366-53.96,54.366c-29.754,0-53.96-24.389-53.96-54.366c0-8.843,2.038-17.273,6.057-25.055c1.906-3.692,0.482-8.241-3.182-10.161c-3.665-1.919-8.178-0.486-10.085,3.206c-5.067,9.812-7.746,20.881-7.746,32.01C187.085,201.018,218,232.166,256,232.166s68.915-31.148,68.915-69.435C324.915,124.445,294,93.297,256,93.297z" />
    <path d="M511.426,501.571l-73.804-178.665c-1.16-2.809-3.883-4.639-6.903-4.639h-73.547c14.305-19.498,26.212-38.919,35.511-57.988c16.48-33.794,24.835-66.613,24.835-97.547C417.517,73.001,345.061,0,256,0S94.483,73.001,94.483,162.731c0,30.934,8.355,63.754,24.835,97.547c9.298,19.069,21.205,38.491,35.511,57.988H81.282c-3.02,0-5.744,1.831-6.903,4.639L24.087,444.651c-1.587,3.842,0.217,8.252,4.03,9.85c0.94,0.394,1.912,0.581,2.87,0.581c2.93,0,5.711-1.746,6.906-4.641l7.176-17.372h50.906l-26.38,63.862H18.69l7.647-18.513c1.587-3.842-0.217-8.252-4.03-9.85c-3.815-1.601-8.191,0.219-9.777,4.06L0.575,501.571c-0.961,2.325-0.705,4.981,0.683,7.075c1.386,2.095,3.72,3.354,6.22,3.354h497.044c2.499,0,4.834-1.259,6.221-3.354C512.13,506.552,512.387,503.896,511.426,501.571z" />
  </svg>
);

const IconProjeto = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M9 10h.01M15 10h.01" />
  </svg>
);

const IconClube = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M2 18c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0" />
    <path d="M2 13c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0" />
    <path d="M12 3v7M8 6l4-3 4 3" />
  </svg>
);

const IconLotes = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
  </svg>
);

const MODULES = [
  { id: '01', label: 'Localização', icon: <IconLocalizacao />, route: null },
  { id: '02', label: 'Projeto',     icon: <IconProjeto />,     route: null },
  { id: '03', label: 'Clube',       icon: <IconClube />,       route: null },
  { id: '04', label: 'Lotes',       icon: <IconLotes />,       route: null },
];

const PHASE = { ESPERA: 'espera', FIXO: 'fixo', SAI: 'sai' };

export default function Home() {
  const { startTransition } = useTransition();
  const sceneRef  = useRef(null);
  const heroRef   = useRef(null);
  const panelRef  = useRef(null);
  const logoRef   = useRef(null);
  const btnsRef   = useRef([]);
  const footerRef = useRef(null);

  const [phase, setPhase] = useState(PHASE.ESPERA);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sceneRef.current, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => setPhase(PHASE.FIXO) });

      tl.to(sceneRef.current,    { opacity: 1,              duration: 0.7, ease: 'power2.inOut' });
      tl.from(heroRef.current,   { scale: 1.06, opacity: 0, duration: 1.3, ease: 'power2.out'   }, '-=0.4');
      tl.from(panelRef.current,  { x: -40, opacity: 0,      duration: 0.9, ease: 'power3.out'   }, '-=0.9');
      tl.from(logoRef.current,   { opacity: 0, y: 20,       duration: 0.6, ease: 'power2.out'   }, '-=0.5');
      tl.from(footerRef.current, { opacity: 0,              duration: 0.4                       }, '-=0.2');
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const handleModuleClick = useCallback((mod) => {
    if (phase !== PHASE.FIXO || !mod.route) return;

    setPhase(PHASE.SAI);

    const tl = gsap.timeline({ onComplete: () => startTransition(mod.route, mod.label) });

    tl.to(btnsRef.current,   { opacity: 0, y: 16, duration: 0.22, stagger: { each: 0.04, from: 'end' }, ease: 'power2.in' });
    tl.to(logoRef.current,   { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, '<');
    tl.to(panelRef.current,  { x: -50, opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.1');
    tl.to(heroRef.current,   { scale: 1.05, opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=0.2');
    tl.to(sceneRef.current,  { opacity: 0, duration: 0.3 }, '-=0.15');
  }, [phase, startTransition]);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {/* Hero image — full background */}
      <div ref={heroRef} className={styles.hero}>
        <img src="/img/hero-praia.jpg" alt="" className={styles.heroImg} />
        <div className={styles.heroGradient} />
      </div>

      {/* Left panel */}
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.accentLine} />

        <div ref={logoRef} className={styles.brand}>
          <p className={styles.eyebrow}>Bem-vindo à</p>
          <img src="/img/bravia-logo-branco.svg" alt="Bravia Marina" className={styles.wordmark} />
          <p className={styles.tagline}>Marina &nbsp;·&nbsp; Clube de Praia &nbsp;·&nbsp; Lotes Residenciais</p>
        </div>

        <nav className={styles.nav}>
          {MODULES.map((mod, i) => (
            <NavButton
              key={mod.id}
              ref={el => (btnsRef.current[i] = el)}
              icon={mod.icon}
              label={mod.label}
              index={mod.id}
              delay={0.75 + i * 0.08}
              disabled={phase !== PHASE.FIXO || !mod.route}
              onClick={() => handleModuleClick(mod)}
            />
          ))}
        </nav>

        <div ref={footerRef} className={styles.footer}>
          <span className={styles.footerLine} />
          <img src="/img/bravia-simbolo-branco.svg" alt="" className={styles.footerSymbol} />
          <span className={styles.footerLine} />
        </div>
      </div>
    </div>
  );
}
