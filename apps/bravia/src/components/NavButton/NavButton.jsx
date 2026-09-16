import { forwardRef } from 'react';
import styles from './NavButton.module.css';

const NavButton = forwardRef(function NavButton({ icon, label, index, onClick, disabled, delay = 0 }, ref) {
  return (
    <button
      ref={ref}
      className={`${styles.btn} ${!disabled ? styles.active : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.index}>{index}</span>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
      <span className={styles.underline} />
    </button>
  );
});

export default NavButton;
