import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import NavDrawer, { useNavDrawer } from '../../components/NavDrawer/NavDrawer';
import styles from './Galeria.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AREAS = [
  { slug: 'vista-aerea',       label: 'Vista Aérea',         description: 'O complexo completo em meio à natureza.' },
  { slug: 'receptivo',         label: 'Receptivo',           description: 'Entrada e controle de acesso do clube.' },
  { slug: 'piscina-ondas',     label: 'Piscina de Ondas',    description: 'Ondas para surfistas de todos os níveis.' },
  { slug: 'piscina-surf',      label: 'Piscina de Surf',     description: 'A grande lagoa cercada de areia e palmeiras.' },
  { slug: 'praia-artificial',  label: 'Praia Artificial',    description: 'Areia branca, espreguiçadeiras e cabanas.' },
  { slug: 'lounge-aquatico',   label: 'Lounge Aquático',     description: 'Descanso com os pés na água.' },
  { slug: 'bar-molhado',       label: 'Bar Molhado',         description: 'Drinks sem sair da piscina.' },
  { slug: 'piscina-infantil',  label: 'Piscina Infantil',    description: 'Espaço seguro para os pequenos.' },
  { slug: 'rio-lento',         label: 'Rio Lento',           description: 'Passeio relaxante pela correnteza.' },
  { slug: 'day-beds',          label: 'Day Beds',            description: 'Conforto e privacidade à beira da água.' },
  { slug: 'alimentos-bebidas', label: 'Alimentos e Bebidas', description: 'Gastronomia dentro do complexo.' },
  { slug: 'restaurantes',      label: 'Restaurantes',        description: 'Opções para todos os momentos do dia.' },
  { slug: 'lojas',             label: 'Mall Aberto',         description: 'Lojas e serviços a céu aberto.' },
  { slug: 'quadras-tenis',     label: 'Quadras de Tênis',    description: 'Quadras profissionais no centro esportivo.' },
  { slug: 'quadra-areia',      label: 'Quadra de Areia',     description: 'Beach tennis, vôlei e futevôlei.' },
  { slug: 'campo-futebol',     label: 'Campo de Futebol',    description: 'Campo e quadras de beach tennis.' },
  { slug: 'skate-park',        label: 'Skate Park',          description: 'Pista para skatistas e amadores.' },
  { slug: 'academia',          label: 'Academia',            description: 'Espaço fitness completo.' },
  { slug: 'spa',               label: 'SPA Wellness',        description: 'Bem-estar e relaxamento.' },
  { slug: 'yoga',              label: 'Yoga',                description: 'Sala dedicada à prática.' },
  { slug: 'ballet',            label: 'Ballet',              description: 'Estúdio de dança.' },
  { slug: 'boliche',           label: 'Boliche',             description: 'Diversão para toda a família.' },
  { slug: 'game-room',         label: 'Game Room',           description: 'Sala de jogos e entretenimento.' },
];

const src = (slug) => `/img/galeria/${slug}.webp`;

export default function Galeria() {
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

        <header className={styles.topBar}>
          <img
            src="/img/logo.svg"
            className={styles.logoSmall}
            alt="Reserva Beach Club"
            draggable={false}
            onClick={() => startTransition('/', '')}
          />
          <nav className={styles.topTabs}>
            <span className={styles.pageTitle}>galeria</span>
          </nav>
          <button className={styles.closeBtn} onClick={openDrawer}>
            <IconClose />
          </button>
        </header>

        <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute="/modulo/04" />

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
                  <img className={styles.thumb} src={`/img/galeria/thumbs/${item.slug}.webp`} alt="" draggable={false} />
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
