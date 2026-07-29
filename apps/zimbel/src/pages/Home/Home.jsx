import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ZimbelLogo from '../../components/ZimbelLogo/ZimbelLogo';
import styles from './Home.module.css';

const EMPREENDIMENTOS = [
  {
    id: 'vertice',
    nome: 'Vértice',
    subtitulo: 'Anália Franco',
    descricao: 'O futuro agradece suas escolhas',
    badge: null,
    url: 'https://showcase.zimbel.com.br',
    img: '/img/vertice-thumb.jpg',
    accent: '#C5A26A',
  },
  {
    id: 'evolution',
    nome: 'Evolution',
    subtitulo: 'Tatuapé',
    descricao: 'Em breve',
    badge: 'EM BREVE',
    url: null,
    img: null,
    accent: '#5B0A28',
  },
];

export default function Home() {
  const sceneRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

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

  function handleClick(url) {
    if (!url) return;
    window.open(url, '_blank');
  }

  return (
    <div ref={sceneRef} className={styles.scene}>
      {/* Fundo decorativo — símbolo Z em marca d'água */}
      <div className={styles.watermark} aria-hidden>
        <ZimbelLogo color="#5B0A28" width={900} />
      </div>

      {/* Linha horizontal sutil */}
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
            onClick={() => handleClick(emp.url)}
            role={emp.url ? 'button' : undefined}
            tabIndex={emp.url ? 0 : undefined}
          >
            {/* Imagem / placeholder */}
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

            {/* Info */}
            <div className={styles.cardInfo}>
              <div className={styles.cardAccentLine} style={{ background: emp.accent }} />
              <p className={styles.cardSubtitulo}>{emp.subtitulo}</p>
              <h2 className={styles.cardNome}>{emp.nome}</h2>
              <p className={styles.cardDesc}>{emp.descricao}</p>
              {emp.url && (
                <span className={styles.cardCta}>
                  ACESSAR SHOWCASE →
                </span>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2025 Zimbel Incorporadora · Todos os direitos reservados</span>
      </footer>
    </div>
  );
}
