import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ZimbelLogo from '../../components/ZimbelLogo/ZimbelLogo';
import styles from './Home.module.css';

const VERTICE_URL = import.meta.env.VITE_VERTICE_URL ?? 'http://localhost:5175';

const EMPREENDIMENTOS = [
  {
    id: 'vertice',
    nome: 'Vértice',
    subtitulo: 'Anália Franco',
    descricao: 'O futuro agradece suas escolhas',
    badge: null,
    iframeUrl: VERTICE_URL,
    img: '/img/vertice-thumb.jpg',
    accent: '#C5A26A',
  },
  {
    id: 'evolution',
    nome: 'Evolution',
    subtitulo: 'Tatuapé',
    descricao: 'Em breve',
    badge: 'EM BREVE',
    iframeUrl: null,
    img: null,
    accent: '#5B0A28',
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
      gsap.set(headerRef.current, { autoAlpha: 0, y: -30 });
      cardsRef.current.forEach(c => c && gsap.set(c, { autoAlpha: 0, y: 40 }));

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      tl.to(
        cardsRef.current.filter(Boolean),
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.15 },
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
      {/* Fundo decorativo — símbolo Z em marca d'água */}
      <div className={styles.watermark} aria-hidden>
        <ZimbelLogo color="#5B0A28" width={900} />
      </div>

      {/* Linha de acento */}
      <div className={styles.accentBar} />

      {/* Header */}
      <header ref={headerRef} className={styles.header}>
        <ZimbelLogo color="white" width={340} />
        <p className={styles.tagline}>CATÁLOGO DE EMPREENDIMENTOS</p>
      </header>

      {/* Cards */}
      <main className={styles.cards}>
        {EMPREENDIMENTOS.map((emp, i) => (
          <div
            key={emp.id}
            ref={el => (cardsRef.current[i] = el)}
            className={`${styles.card} ${emp.badge ? styles.cardComingSoon : styles.cardActive}`}
            onClick={() => openShowcase(emp)}
            role={emp.iframeUrl ? 'button' : undefined}
            tabIndex={emp.iframeUrl ? 0 : undefined}
          >
            <div className={styles.cardImg}>
              {emp.img ? (
                <img src={emp.img} alt={emp.nome} className={styles.cardImgEl} />
              ) : (
                <div className={styles.cardImgPlaceholder}>
                  <ZimbelLogo color="#5B0A28" width={160} />
                </div>
              )}
              {emp.badge && (
                <span className={styles.comingSoonBadge}>{emp.badge}</span>
              )}
            </div>

            <div className={styles.cardInfo}>
              <div className={styles.cardAccentLine} style={{ background: emp.accent }} />
              <p className={styles.cardSubtitulo}>{emp.subtitulo}</p>
              <h2 className={styles.cardNome}>{emp.nome}</h2>
              <p className={styles.cardDesc}>{emp.descricao}</p>
              {emp.iframeUrl && (
                <span className={styles.cardCta}>ACESSAR SHOWCASE →</span>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2025 Zimbel Incorporadora · Todos os direitos reservados</span>
      </footer>

      {/* Overlay fullscreen com iframe do showcase */}
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
