import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import styles from './Galeria.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PHOTOS = [
  { slug: 'portico',            title: 'Pórtico de Acesso',     description: 'Entrada monumental do empreendimento.' },
  { slug: 'praia-artificial',   title: 'Praia Artificial',      description: 'Areia e águas cristalinas para o dia a dia.' },
  { slug: 'canal-atracadouro',  title: 'Canal e Atracadouro',   description: 'Passarela sobre o canal com acesso às embarcações.' },
  { slug: 'clubhouse-frente-1', title: 'Clubhouse',             description: 'Vista aérea do clubhouse e seu entorno.' },
  { slug: 'clubhouse-fundos',   title: 'Clubhouse — Fundos',    description: 'Passarela e lagos integrados ao clubhouse.' },
  { slug: 'beach-club',         title: 'Beach Club',            description: 'Área de convivência com piscina e deck.' },
  { slug: 'bar-clube',          title: 'Bar do Clube',          description: 'Bar e terraço para encontros ao entardecer.' },
  { slug: 'hall',               title: 'Hall',                  description: 'Recepção acolhedora com lounge e escada escultural.' },
  { slug: 'gourmet',            title: 'Espaço Gourmet',        description: 'Salão para eventos e refeições em família.' },
  { slug: 'academia',           title: 'Academia',              description: 'Espaço fitness com vista para o jardim.' },
  { slug: 'piscina',            title: 'Piscina',               description: 'Piscina interna integrada à natureza.' },
  { slug: 'rooftop',            title: 'Rooftop',               description: 'Terraço com bar e visual privilegiado.' },
  { slug: 'rooftop-02',         title: 'Rooftop — Vista 2',     description: 'Pérgola e paisagismo ao pôr do sol.' },
  { slug: 'heliponto',          title: 'Heliponto',             description: 'Chegada e partida com máxima praticidade.' },
  { slug: 'market',             title: 'Market Place',          description: 'Conveniência dentro do condomínio.' },
  { slug: 'jet-ski',            title: 'Marina / Jet Ski',      description: 'Lagos para a prática de esportes náuticos.' },
  { slug: 'praia',              title: 'Praia',                 description: 'Faixa de areia para caminhar e relaxar.' },
  { slug: 'quadras-aerea',      title: 'Quadras — Vista Aérea', description: 'O complexo esportivo visto de cima.' },
  { slug: 'quadras',            title: 'Quadras Esportivas',    description: 'Quadras para diversas modalidades esportivas.' },
  { slug: 'quadras-observador', title: 'Quadras — Observador',  description: 'Quadras cercadas por paisagismo tropical.' },
  { slug: 'suite-vista',        title: 'Suíte com Vista',       description: 'Suíte aberta para a piscina e a natureza.' },
  { slug: 'vista-fundos',       title: 'Vista dos Fundos',      description: 'Casas com fundos voltados para o verde.' },
];

const src = (slug) => `/img/galeria/${slug}.avif`;

export default function Galeria() {
  const { startTransition } = useTransition();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  const sceneRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    gsap.fromTo(sceneRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
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
    img.src = src(PHOTOS[i].slug);
  }, []);

  const current = PHOTOS[index];

  return (
    <div ref={sceneRef} className={styles.scene}>

      {prevIndex !== null && (
        <img key={`prev-${prevIndex}`} className={styles.heroImg} src={src(PHOTOS[prevIndex].slug)} alt="" draggable={false} />
      )}
      <img key={`cur-${index}`} className={`${styles.heroImg} ${prevIndex !== null ? styles.heroFade : ''}`} src={src(current.slug)} alt={current.title} draggable={false} />

      <div className={styles.vignette} />

      <div className={styles.topBar}>
        <button className={styles.brand} onClick={() => startTransition('/', '')}>
          <img src="/img/bravia-simbolo-branco.svg" alt="" className={styles.brandMark} />
          <span className={styles.brandWord}>BRÁVIA</span>
        </button>

        <div className={styles.topActions}>
          <div className={styles.hint}>Galeria — selecione um espaço para conhecer</div>
          <button className={styles.roundBtn} aria-label="Fechar" onClick={() => startTransition('/', '')}>
            <IconClose />
          </button>
        </div>
      </div>

      <div className={styles.panelWrap}>
        <div className={styles.panel}>
          {PHOTOS.map((item, i) => (
            <button
              key={item.slug}
              className={`${styles.item} ${i === index ? styles.itemActive : ''}`}
              onClick={() => select(i)}
            >
              <img className={styles.thumb} src={`/img/galeria/thumbs/${item.slug}.avif`} alt="" draggable={false} />
              <span className={styles.itemText}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemDesc}>{item.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
