import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import styles from './Construtora.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconPlay = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);

const TABS = [
  { id: 'construtora', label: 'construtora' },
  { id: 'quem-somos', label: 'quem somos' },
];

export default function Construtora() {
  const { startTransition } = useTransition();
  const [tab, setTab] = useState('construtora');
  const [videoOpen, setVideoOpen] = useState(false);

  const sceneRef   = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef   = useRef(null);
  const playRef    = useRef(null);
  const closeRef   = useRef(null);
  const tabsRef    = useRef(null);
  const videoRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(tabsRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      )
      .fromTo(eyebrowRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.2'
      )
      .fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(playRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' },
        '-=0.4'
      )
      .fromTo(closeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.6'
      );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const openVideo = () => setVideoOpen(true);

  const closeVideo = (e) => {
    e.stopPropagation();
    if (videoRef.current) videoRef.current.pause();
    setVideoOpen(false);
  };

  return (
    <div className={styles.scene} ref={sceneRef}>

      {/* Botão fechar */}
      <button className={styles.closeBtn} ref={closeRef} onClick={() => startTransition('/', '')}>
        <IconClose />
      </button>

      {/* Menu de abas */}
      <nav className={styles.tabs} ref={tabsRef}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Aba: construtora */}
      {tab === 'construtora' && (
        <div className={styles.center}>
          <span className={styles.eyebrow} ref={eyebrowRef}>A CONSTRUTORA</span>
          <div className={styles.titleRow} ref={titleRef}>
            <h1 className={styles.title}>SIVERCON</h1>

            {/* Botão play inline */}
            <button className={styles.playBtn} ref={playRef} onClick={openVideo}>
              <span className={styles.playRing} />
              <span className={styles.playRing} />
              <span className={styles.playIcon}><IconPlay /></span>
              <span className={styles.playLabel}>ASSISTA<br />AGORA</span>
            </button>
          </div>
        </div>
      )}

      {/* Aba: quem somos */}
      {tab === 'quem-somos' && (
        <div className={styles.quemSomos}>
          {/* Coluna esquerda — texto */}
          <div className={styles.qsLeft}>
            <span className={styles.eyebrow}>QUEM SOMOS</span>
            <h2 className={styles.qsTitle}>Mais de<br /><strong>30 anos</strong><br />construindo histórias</h2>
            <p className={styles.qsText}>
              Pioneira na região próxima ao Metrô São Judas, a Sivercon atua como
              Incorporadora, Construtora e Imobiliária — oferecendo venda, aluguel
              e gestão patrimonial com foco em localização privilegiada e soluções inovadoras.
            </p>
          </div>

          {/* Coluna direita — estatísticas */}
          <div className={styles.qsRight}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>41</span>
                <span className={styles.statLabel}>empreendimentos<br />lançados</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>+5mil</span>
                <span className={styles.statLabel}>unidades<br />comercializadas</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>1,1mi</span>
                <span className={styles.statLabel}>m² construídos</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>1992</span>
                <span className={styles.statLabel}>fundação</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logo Sivercon no canto */}
      <img src="/img/sivercon.avif" alt="Sivercon" className={styles.logo} />

      {/* Lightbox vídeo */}
      {videoOpen && (
        <div className={styles.lightbox} onClick={closeVideo}>
          <button className={styles.lightboxClose} onClick={closeVideo}><IconClose /></button>
          <video
            ref={videoRef}
            className={styles.video}
            src="/videos/sivercon.mp4"
            controls
            autoPlay
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}
