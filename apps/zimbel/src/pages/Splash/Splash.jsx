import { useRef } from 'react';
import { gsap } from 'gsap';
import ZimbelLogo from '../../components/ZimbelLogo/ZimbelLogo';
import styles from './Splash.module.css';

export default function Splash({ onStart }) {
  const rootRef = useRef(null);

  function handleAccess() {
    const el = document.documentElement;
    const req = el.requestFullscreen ?? el.webkitRequestFullscreen ?? el.mozRequestFullScreen;
    if (req) req.call(el).catch(() => {});

    gsap.to(rootRef.current, {
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: onStart,
    });
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.card}>
        <p className={styles.welcome}>SEJA BEM VINDO AO TOUCHATTA</p>

        <div className={styles.logoWrap}>
          <ZimbelLogo color="white" width={300} />
        </div>

        <div className={styles.divider} />

        <button className={styles.btn} onClick={handleAccess}>
          ACESSAR CATÁLOGO
        </button>

        <p className={styles.hint}>
          PARA UMA MELHOR EXPERIÊNCIA DE NAVEGAÇÃO<br />
          ESTE TOUCHATTA SERÁ EXECUTADO EM TELA CHEIA.
        </p>
      </div>
    </div>
  );
}
