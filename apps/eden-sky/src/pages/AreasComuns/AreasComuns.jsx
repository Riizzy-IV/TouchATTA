import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './AreasComuns.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AREAS = [
  { slug: 'piscina',       label: 'Piscina',              description: 'Piscina adulto e infantil para o dia a dia.' },
  { slug: 'parquinho',     label: 'Parquinho',            description: 'Espaço de brincar para as crianças.' },
  { slug: 'academia',      label: 'Academia',             description: 'Espaço fitness completo, com vista.' },
  { slug: 'gourmet',       label: 'Espaço Gourmet',       description: 'Ambiente para receber amigos e família.' },
  { slug: 'jogos',         label: 'Salão de Jogos',       description: 'Diversão e convivência para todas as idades.' },
  { slug: 'poliesportiva', label: 'Quadra Poliesportiva', description: 'Quadra para diversas modalidades esportivas.' },
  { slug: 'pilates',       label: 'Espaço Pilates',       description: 'Bem-estar e equilíbrio dentro de casa.' },
  { slug: 'salao-festas',  label: 'Salão de Festas',      description: 'Espaço de eventos para celebrar com conforto.' },
  { slug: 'spa',           label: 'SPA',                  description: 'Relaxamento e cuidado, com crioterapia.' },
  { slug: 'lobby',         label: 'Lobby',                description: 'Recepção elegante, mobiliada e decorada.' },
  { slug: 'delivery',      label: 'Delivery Room',        description: 'Espaço dedicado ao recebimento de encomendas.' },
  { slug: 'salao-beleza',  label: 'Salão de Beleza',      description: 'Cuidados de beleza sem sair do condomínio.' },
];

const src = (slug) => `/img/areas/${slug}.avif`;

export default function AreasComuns() {
  const { startTransition } = useTransition();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  const contentRef = useRef(null);
  const indexRef   = useRef(0);

  useEffect(() => {
    gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, []);

  const select = useCallback((i) => {
    if (i === indexRef.current) return;
    const img = new Image();
    const commit = () => {
      setPrevIndex(indexRef.current);
      indexRef.current = i;
      setIndex(i);
    };
    img.onload = commit;
    img.onerror = commit;
    img.src = src(AREAS[i].slug);
  }, []);

  const current = AREAS[index];

  return (
    <div className={styles.scene}>
      <div className={styles.content} ref={contentRef}>

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
            <span className={styles.pageTitle}>áreas comuns</span>
          </nav>
          <button className={styles.closeBtn} onClick={openDrawer}>
            <IconClose />
          </button>
        </header>

        <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/04" />

        {/* Corpo: imagem em tela cheia + lista de espaços */}
        <div className={styles.body}>
          {prevIndex !== null && (
            <img key={`prev-${prevIndex}`} className={styles.heroImg} src={src(AREAS[prevIndex].slug)} alt="" draggable={false} />
          )}
          <img
            key={`cur-${index}`}
            className={`${styles.heroImg} ${prevIndex !== null ? styles.heroFade : ''}`}
            src={src(current.slug)}
            alt={current.label}
            draggable={false}
          />
          <div className={styles.vignette} />

          <div className={styles.panelWrap}>
            <div className={styles.panel}>
              {AREAS.map((item, i) => (
                <button
                  key={item.slug}
                  className={`${styles.item} ${i === index ? styles.itemActive : ''}`}
                  onClick={() => select(i)}
                >
                  <img className={styles.thumb} src={`/img/areas/thumbs/${item.slug}.avif`} alt="" draggable={false} />
                  <span className={styles.itemText}>
                    <span className={styles.itemTitle}>{item.label}</span>
                    <span className={styles.itemDesc}>{item.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
