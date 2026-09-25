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
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5a1 1 0 0 0 1 1H10v-5.5h4V20.5h3.5a1 1 0 0 0 1-1V10" />
  </svg>
);

const IconLocalizacao = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);

const IconProjeto = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <rect x="4" y="4" width="16" height="16" rx="0.6" />
    <path d="M4 14h7v6" />
    <path d="M14 4v7h6" />
    <path d="M11 14a3 3 0 0 0 3-3" />
  </svg>
);

const IconGaleria = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
    <circle cx="8" cy="10" r="1.3" />
    <path d="M4.2 16.5 8.5 12l3.5 3.5 2.5-2.5 4.8 4.5" />
  </svg>
);

const IconSocio = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <circle cx="9.5" cy="8.5" r="3" />
    <path d="M3.8 19.5c0-3.2 2.5-5.5 5.7-5.5s5.7 2.3 5.7 5.5" />
    <path d="M15.5 5.7a3 3 0 0 1 0 5.6" />
    <path d="M17.6 14.4c1.7.7 2.8 2.4 2.8 5.1" />
  </svg>
);

const NAV_MODULES = [
  { route: '/',          label: 'Home',    icon: <IconHome /> },
  { route: '/modulo/02', label: 'Localização', icon: <IconLocalizacao /> },
  { route: '/modulo/03', label: 'Projeto', icon: <IconProjeto /> },
  { route: '/modulo/04', label: 'Galeria', icon: <IconGaleria /> },
  { route: '/modulo/05', label: 'Sócio',   icon: <IconSocio /> },
];

export function useNavDrawer() {
  const drawerRef = useRef(null);
  const isOpen     = useRef(false);

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
