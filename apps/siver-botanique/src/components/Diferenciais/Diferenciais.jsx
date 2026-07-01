import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  FaBolt, FaSnowflake, FaSwimmingPool, FaBuilding,
  FaShieldAlt, FaVideo, FaLock, FaMobileAlt,
  FaTint, FaLeaf, FaSolarPanel, FaCubes,
} from 'react-icons/fa';
import styles from './Diferenciais.module.css';

const SECTIONS = [
  {
    id: 'infraestrutura',
    title: 'INFRAESTRUTURA',
    panelColor: '#3d5446',
    titleColor: '#1e2e26',
    photo: '/img/fachada-01.avif',
    photo2: '/img/piscina-01.avif',
    items: [
      { icon: <FaBolt size={28} />,        text: 'Gerador de energia elétrica para as áreas comuns, bombas, portões e elevadores' },
      { icon: <FaSnowflake size={28} />,   text: 'Áreas comuns entregues equipadas com ar-condicionado e decoradas' },
      { icon: <FaSwimmingPool size={28} />, text: 'Piscina climatizada para uso em qualquer época do ano' },
      { icon: <FaBuilding size={28} />,    text: 'Lazer elevado no 6º pavimento com vista privilegiada do empreendimento' },
    ],
  },
  {
    id: 'seguranca',
    title: 'SEGURANÇA',
    panelColor: '#111a15',
    titleColor: '#0a110d',
    photo: '/img/fachada-cena-02.avif',
    photo2: '/img/fachada-02.avif',
    items: [
      { icon: <FaShieldAlt size={28} />, text: 'Portaria 24 horas com controle de acesso e monitoramento permanente' },
      { icon: <FaVideo size={28} />,     text: 'Câmeras de monitoramento em todas as áreas comuns e acessos' },
      { icon: <FaLock size={28} />,      text: 'Fechadura digital nas unidades com acionamento por senha e cartão' },
      { icon: <FaMobileAlt size={28} />, text: 'Interfone com vídeo para comunicação segura com a portaria' },
    ],
  },
  {
    id: 'sustentabilidade',
    title: 'SUSTENTABILIDADE',
    panelColor: '#4d6e50',
    titleColor: '#2c4430',
    photo: '/img/floral-botanical.avif',
    photo2: '/img/outdoor.avif',
    items: [
      { icon: <FaTint size={28} />,       text: 'Reservatório de reuso de água pluvial para irrigação e limpeza' },
      { icon: <FaLeaf size={28} />,       text: 'Área permeável de 1.500,76 m² favorecendo o escoamento natural' },
      { icon: <FaSolarPanel size={28} />, text: 'Paisagismo com espécies nativas e iluminação LED nas áreas comuns' },
      { icon: <FaCubes size={28} />,      text: 'Estrutura em alvenaria estrutural com maior durabilidade e eficiência' },
    ],
  },
];

export default function Diferenciais() {
  const [active, setActive] = useState(null);
  const sectionsRef = useRef([]);
  const contentRefs = useRef([]);

  useEffect(() => {
    const idx = SECTIONS.findIndex(s => s.id === active);
    if (contentRefs.current[idx]) {
      gsap.fromTo(
        contentRefs.current[idx].querySelectorAll(`.${styles.item}`),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [active]);

  return (
    <div className={styles.wrapper}>
      {SECTIONS.map((sec, i) => {
        const isActive = active === sec.id;
        return (
          <div
            key={sec.id}
            ref={el => (sectionsRef.current[i] = el)}
            className={`${styles.section} ${isActive ? styles.sectionActive : ''}`}
            onClick={() => setActive(isActive ? null : sec.id)}
            style={{ '--panel-color': sec.panelColor, '--title-color': sec.titleColor }}
          >
            {/* Painel esquerdo */}
            <div className={styles.left}>
              {isActive ? (
                <div className={styles.content} ref={el => (contentRefs.current[i] = el)}>
                  <div className={styles.grid}>
                    {sec.items.map((item, j) => (
                      <div key={j} className={styles.item}>
                        <span className={styles.itemIcon}>{item.icon}</span>
                        <p className={styles.itemText}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.pulseWrap}>
                    <span className={styles.pulseRing} />
                    <span className={styles.pulseRing} />
                  </div>
                  <span className={styles.titleCollapsed}>{sec.title}</span>
                </>
              )}
            </div>

            {/* Painel direito — fotos */}
            <div className={styles.right}>
              <img src={sec.photo}  alt="" className={styles.photo} draggable={false} />
              <img src={sec.photo2} alt="" className={styles.photo} draggable={false} />
              {!isActive && <div className={styles.overlay} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
