import { useState } from 'react';
import { useTransition } from '@showcase/core';
import styles from './ModuleLayout.module.css';

const IconX = () => (
  <svg viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ModuleLayout({ tabs = [], defaultTab, children }) {
  const { closeModule } = useTransition();
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0] ?? '');

  const activeContent = typeof children === 'function'
    ? children(activeTab)
    : children;

  return (
    <div className={styles.scene}>
      <header className={styles.topBar}>
        <div className={styles.brand} onClick={closeModule} style={{ cursor: 'pointer' }}>
          <span className={styles.brandName}>VĒRTICE</span>
          <span className={styles.brandSub}>ANÁLIA FRANCO</span>
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

        <button className={styles.closeBtn} onClick={closeModule} aria-label="Fechar">
          <IconX />
        </button>
      </header>

      <div className={styles.content}>
        {activeContent}
      </div>
    </div>
  );
}
