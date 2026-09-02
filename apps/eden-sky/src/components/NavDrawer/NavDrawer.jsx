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
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M3 9h18M9 9v11" />
  </svg>
);

const IconAreas = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M2 17c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" />
    <path d="M2 12c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" />
  </svg>
);

const IconUnidades = () => (
  <svg viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
    <path d="M12 3.5V20.5M3.5 12H20.5" />
  </svg>
);

const NAV_MODULES = [
  { route: '/',          label: 'Home',          icon: <IconHome /> },
  { route: '/modulo/02', label: 'Localização',   icon: <IconLocalizacao /> },
  { route: '/modulo/03', label: 'Projeto',       icon: <IconProjeto /> },
  { route: '/modulo/04', label: 'Áreas Comuns',  icon: <IconAreas /> },
  { route: '/modulo/05', label: 'Unidades',      icon: <IconUnidades /> },
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
