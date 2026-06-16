import { forwardRef } from 'react';
import styles from './NavButton.module.css';

const NavButton = forwardRef(function NavButton({ icon, label, onClick, disabled, delay = 0 }, ref) {
  return (
    <button
      ref={ref}
      className={`${styles.btn} ${!disabled ? styles.active : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.circle}>
        {icon}
        <span className={styles.ring} />
        <span className={styles.ring} style={{ animationDelay: '0.5s' }} />
      </span>
      <span className={styles.label}>
        {label.split(' ').map((word, i) => <span key={i}>{word}</span>)}
      </span>
    </button>
  );
});

export default NavButton;
