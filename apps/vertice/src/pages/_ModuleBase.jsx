import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import styles from './_ModuleBase.module.css';

export default function ModuleBase({ number, title, description }) {
  const navigate = useNavigate();
  const sceneRef = useRef(null);
  const contentRef = useRef(null);

  // Entrada: fade-in + slide-up (mesmo padrão da Home)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sceneRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' });
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        delay: 0.2,
        ease: 'power2.out',
      });
    });
    return () => ctx.revert();
  }, []);

  function handleBack() {
    const ctx = gsap.context(() => {
      gsap.to(sceneRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => navigate('/'),
      });
    });
  }

  return (
    <div ref={sceneRef} className={styles.scene}>
      <div ref={contentRef} className={styles.content}>
        <span className={styles.number}>{number}</span>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.placeholder}>
          <span>Conteúdo do {title}</span>
          <small>Substitua este bloco pelo conteúdo real do módulo.</small>
        </div>

        <button className={styles.backBtn} onClick={handleBack}>
          ← Voltar ao início
        </button>
      </div>
    </div>
  );
}
