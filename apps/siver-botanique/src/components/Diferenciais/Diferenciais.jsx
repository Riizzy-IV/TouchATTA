import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  FaBolt, FaCouch, FaParking,
  FaShieldAlt, FaBoxOpen, FaFireExtinguisher,
  FaTree, FaTint,
} from 'react-icons/fa';
import { MdElevator } from 'react-icons/md';
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
      { icon: <FaBolt size={28} />,     text: 'Gerador de energia elétrica para áreas comuns, bombas, portões e elevadores' },
      { icon: <FaCouch size={28} />,    text: 'Áreas comuns entregues equipadas e decoradas' },
      { icon: <MdElevator size={28} />, text: 'Elevador do edifício garagem' },
      { icon: <FaParking size={28} />,  text: 'Todas unidades com vaga' },
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
      { icon: <FaShieldAlt size={28} />,       text: 'Portaria 24 horas com controle de acesso e monitoramento permanente' },
      { icon: <FaBoxOpen size={28} />,         text: 'Armários delivery na antecâmara da área de controle de acesso' },
      { icon: <FaFireExtinguisher size={28} />, text: 'Escadas confinadas e pressurizadas, com iluminação de emergência e portas corta-fogo, sistema de combate a incêndio com hidrantes, extintores e sinalização' },
    ],
  },
  {
    id: 'sustentabilidade',
    title: 'SUSTENTABILIDADE',
    panelColor: '#4d6e50',
    titleColor: '#2c4430',
    photo: '/img/piscina-01.avif',
    photo2: '/img/outdoor.avif',
    items: [
      { icon: <FaTree size={28} />, text: 'Paisagismo integrado às árvores existentes, com preservação de aproximadamente 40% dos indivíduos arbóreos do terreno' },
      { icon: <FaTint size={28} />, text: 'Mais de 1.500 m² de área permeável integrada ao projeto' },
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

            {/* Painel direito — foto */}
            <div className={styles.right}>
              <img src={sec.photo} alt="" className={styles.photo} draggable={false} />
              {!isActive && <div className={styles.overlay} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
