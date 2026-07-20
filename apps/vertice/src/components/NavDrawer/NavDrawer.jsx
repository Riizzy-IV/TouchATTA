import { useRef } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '../../context/TransitionContext';
import styles from './NavDrawer.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const NAV_MODULES = [
  { route: '/',         label: 'Home',         icon: <IconHome /> },
  { route: '/modulo/02', label: 'Bairro',       icon: <img src="/img/home/icon-bairro.svg" alt="" /> },
  { route: '/modulo/03', label: 'Projeto',      icon: <img src="/img/home/icon-projeto.svg" alt="" /> },
  { route: '/modulo/04', label: 'Áreas Comuns', icon: <img src="/img/home/icon-areas.svg" alt="" /> },
  { route: '/modulo/05', label: 'Unidades',     icon: <img src="/img/home/icon-unidades.svg" alt="" /> },
];

export function useNavDrawer() {
  const drawerRef = useRef(null);
  const isOpen    = useRef(false);

  const open = () => {
    if (isOpen.current) return;
    isOpen.current = true;
    if (drawerRef.current) {
      drawerRef.current.style.display = 'flex';
      gsap.fromTo(drawerRef.current,
        { x: 96, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
  };

  const close = () => {
    if (!isOpen.current || !drawerRef.current) return;
    gsap.to(drawerRef.current, {
      x: 96, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        if (drawerRef.current) drawerRef.current.style.display = 'none';
        isOpen.current = false;
      },
    });
  };

  return { drawerRef, open, close };
}

export default function NavDrawer({ drawerRef, onClose, currentRoute }) {
  const { startTransition, closeModule } = useTransition();

  const goTo = (route) => {
    if (route === currentRoute) { onClose(); return; }
    if (route === '/') { closeModule(); return; }
    startTransition(route);
  };

  return (
    <div className={styles.drawer} ref={drawerRef} style={{ display: 'none' }}>
      <button className={styles.closeBtn} onClick={onClose}>
        <IconClose />
      </button>
      <div className={styles.items}>
        {NAV_MODULES.map(m => (
          <button
            key={m.route}
            className={`${styles.item} ${m.route === currentRoute ? styles.itemActive : ''}`}
            onClick={() => goTo(m.route)}
            title={m.label}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
