import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  FaBuilding, FaStore, FaCar, FaLayerGroup,
  FaShieldAlt, FaVideo, FaIdCard, FaCarSide,
  FaDumbbell, FaPaw, FaBoxOpen, FaChalkboardTeacher,
} from 'react-icons/fa';
import styles from './Diferenciais.module.css';

const SECTIONS = [
  {
    id: 'infraestrutura',
    title: 'INFRAESTRUTURA',
    panelColor: '#8a7444',
    titleColor: '#4a3f26',
    photo: '/img/infra-fachada-lojas.jpg',
    items: [
      { icon: <FaLayerGroup size={28} />, text: '2 torres com 20 pavimentos cada — 1 térreo e 19 tipo' },
      { icon: <FaBuilding size={28} />,   text: '3 elevadores por torre para maior fluidez no dia a dia' },
      { icon: <FaStore size={28} />,      text: 'Fachada ativa com 7 lojas voltadas para a rua' },
      { icon: <FaCar size={28} />,        text: '197 vagas de estacionamento rotativas para visitantes' },
    ],
  },
  {
    id: 'seguranca',
    title: 'SEGURANÇA',
    panelColor: '#332d24',
    titleColor: '#1d1a16',
    photo: '/img/seguranca-portaria.jpg',
    items: [
      { icon: <FaShieldAlt size={28} />, text: 'Guarita de segurança com eclusa e câmeras em toda a área comum' },
      { icon: <FaIdCard size={28} />,    text: 'Acesso de pedestres controlado por reconhecimento facial' },
      { icon: <FaCarSide size={28} />,   text: 'Acesso de veículos controlado via tag' },
      { icon: <FaVideo size={28} />,     text: 'Iluminação dos halls por sensor de presença' },
    ],
  },
  {
    id: 'conveniencia',
    title: 'CONVENIÊNCIA',
    panelColor: '#c49a5a',
    titleColor: '#6b5228',
    photo: '/img/conveniencia-academia.jpg',
    items: [
      { icon: <FaDumbbell size={28} />,           text: 'Espaço Crossfit com academia climatizada e terraço funcional' },
      { icon: <FaPaw size={28} />,                text: 'Pet Place e Pet Wash para os bichos de estimação' },
      { icon: <FaBoxOpen size={28} />,            text: 'Depósito para e-commerce e local para self market' },
      { icon: <FaChalkboardTeacher size={28} />,  text: 'Sala multimídia e sala de administração' },
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
