import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Splash.module.css';

export default function Splash({ onStart }) {
  const rootRef   = useRef(null);
  const logoRef   = useRef(null);
  const btnRef    = useRef(null);
  const labelRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [logoRef.current, btnRef.current, labelRef.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleStart = () => {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    const go = () => {
      gsap.to(rootRef.current, {
        opacity: 0, duration: 0.4, ease: 'power2.in',
        onComplete: onStart,
      });
    };

    if (req) {
      req.call(el).then(go).catch(go);
    } else {
      go();
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.center}>
        <p className={styles.eyebrow} ref={logoRef}>SEJA BEM VINDO AO ATTA TOUCH</p>

        <div className={styles.brand} ref={btnRef}>
          <img src="/img/Logo Siver.png" alt="Siver Botanique" className={styles.logo} />
        </div>

        <button className={styles.btn} onClick={handleStart}>
          INICIAR NAVEGAÇÃO
        </button>

        <p className={styles.hint} ref={labelRef}>
          PARA UMA MELHOR EXPERIÊNCIA DE NAVEGAÇÃO<br />
          ESTE ATTA TOUCH SERÁ EXECUTADO EM TELA CHEIA.
        </p>
      </div>
    </div>
  );
}
