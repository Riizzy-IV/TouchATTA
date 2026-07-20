import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransition } from '../../context/TransitionContext';
import NavDrawer, { useNavDrawer } from '../NavDrawer/NavDrawer';
import styles from './ModuleLayout.module.css';

const IconX = () => (
  <svg viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ModuleLayout({ tabs = [], defaultTab, children }) {
  const { closeModule } = useTransition();
  const { pathname } = useLocation();
  const { drawerRef, open: openDrawer, close: closeDrawer } = useNavDrawer();
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0] ?? '');

  const activeContent = typeof children === 'function'
    ? children(activeTab)
    : children;

  return (
    <div className={styles.scene}>
      <header className={styles.topBar}>
        <div className={styles.brand} onClick={closeModule} style={{ cursor: 'pointer' }}>
          <img src="/img/logo-branca.svg" alt="Vértice Anália Franco" className={styles.brandLogo} />
        </div>

        {tabs.length > 0 && (
          <>
            <div className={styles.divider} />
            <nav className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </>
        )}

        <button className={styles.closeBtn} onClick={openDrawer} aria-label="Abrir menu">
          <IconX />
        </button>
      </header>

      <NavDrawer drawerRef={drawerRef} onClose={closeDrawer} currentRoute={pathname} />

      <div className={styles.content}>
        {activeContent}
      </div>
    </div>
  );
}
