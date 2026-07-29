import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ZimbelLogo from '../../components/ZimbelLogo/ZimbelLogo';
import styles from './Home.module.css';

const VERTICE_URL   = import.meta.env.VITE_VERTICE_URL   ?? 'http://localhost:5175';
const EVOLUTION_URL = import.meta.env.VITE_EVOLUTION_URL ?? 'http://localhost:5176';

const EMPREENDIMENTOS = [
  {
    id: 'vertice',
    nome: 'VÉRTICE',
    bairro: 'ANÁLIA FRANCO',
    badge: 'LANÇAMENTO',
    iframeUrl: VERTICE_URL,
    img: '/img/[Zim] Vertice - card.png',
    accent: '#C5A26A',
  },
  {
    id: 'evolution',
    nome: 'EVOLUTION',
    bairro: 'TATUAPÉ',
    badge: 'LANÇAMENTO',
    iframeUrl: EVOLUTION_URL,
    img: '/img/[Zim] Evolution - card.png',
    accent: '#C5A26A',
  },
];

export default function Home() {
  const sceneRef   = useRef(null);
  const headerRef  = useRef(null);
  const cardsRef   = useRef([]);
  const overlayRef = useRef(null);

  const [activeShowcase, setActiveShowcase] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { autoAlpha: 0, y: -24 });
      cardsRef.current.forEach(c => c && gsap.set(c, { autoAlpha: 0, y: 40 }));

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      tl.to(
        cardsRef.current.filter(Boolean),
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.18 },
        '-=0.3'
      );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  function openShowcase(emp) {
    if (!emp.iframeUrl) return;
    setActiveShowcase(emp);
    gsap.fromTo(overlayRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }
    );
  }

  function closeShowcase() {
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => setActiveShowcase(null),
    });
  }

  return (
    <div ref={sceneRef} className={styles.scene}>
      {/* Header */}
      <header ref={headerRef} className={styles.header}>
        <ZimbelLogo width={180} />
        <p className={styles.tagline}>CATÁLOGO DE EMPREENDIMENTOS</p>
      </header>

      {/* Cards */}
      <main className={styles.cards}>
        {EMPREENDIMENTOS.map((emp, i) => (
          <div
            key={emp.id}
            ref={el => (cardsRef.current[i] = el)}
            className={`${styles.card} ${emp.iframeUrl ? styles.cardActive : styles.cardInactive}`}
            onClick={() => openShowcase(emp)}
            role={emp.iframeUrl ? 'button' : undefined}
            tabIndex={emp.iframeUrl ? 0 : undefined}
          >
            {/* Card image — full portrait */}
            <div className={styles.cardImgWrap}>
              {emp.img ? (
                <img src={emp.img} alt={emp.nome} className={styles.cardImgEl} />
              ) : (
                <div className={styles.cardImgBlank}>
                  <ZimbelLogo width={90} />
                </div>
              )}
            </div>

            {/* CTA button */}
            {emp.iframeUrl ? (
              <button className={styles.ctaBtn}>
                CONHEÇA &nbsp;→
              </button>
            ) : (
              <div className={styles.ctaBtnDisabled}>EM BREVE</div>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2025 Zimbel Incorporadora · Todos os direitos reservados</span>
      </footer>

      {/* Overlay iframe */}
      <div ref={overlayRef} className={styles.overlay} style={{ visibility: 'hidden', opacity: 0 }}>
        {activeShowcase && (
          <>
            <iframe
              className={styles.overlayFrame}
              src={activeShowcase.iframeUrl}
              title={activeShowcase.nome}
              allow="autoplay"
            />
            <button className={styles.backBtn} onClick={closeShowcase} aria-label="Voltar ao catálogo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>CATÁLOGO</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
