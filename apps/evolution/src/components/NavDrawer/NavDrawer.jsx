import { useRef } from 'react';
import { gsap } from 'gsap';
import { useTransition } from '@showcase/core';
import styles from './NavDrawer.module.css';

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconLoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconProject = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const IconGaleria = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const NAV_MODULES = [
  { route: '/',          label: 'Home',        icon: <IconHome /> },
  { route: '/modulo/02', label: 'Localização',  icon: <IconLoc /> },
  { route: '/modulo/03', label: 'Projeto',      icon: <IconProject /> },
  { route: '/modulo/04', label: 'Galeria',      icon: <IconGaleria /> },
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
        { x: 110, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
  };

  const close = () => {
    if (!isOpen.current || !drawerRef.current) return;
    gsap.to(drawerRef.current, {
      x: 110, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        if (drawerRef.current) drawerRef.current.style.display = 'none';
        isOpen.current = false;
      },
    });
  };

  return { drawerRef, open, close };
}

export default function NavDrawer({ drawerRef, onClose, currentRoute }) {
  const { startTransition } = useTransition();

  const goTo = (route) => {
    if (route === currentRoute) { onClose(); return; }
    startTransition(route, '');
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
