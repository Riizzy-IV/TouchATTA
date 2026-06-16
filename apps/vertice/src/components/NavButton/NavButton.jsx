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
      <span className={styles.iconWrap}>
        {icon}
        <span className={styles.ring} />
        <span className={styles.ring} style={{ animationDelay: '0.4s' }} />
      </span>
      <span className={styles.label}>
        {label.split(' ').flatMap((word, i) => i === 0 ? [word] : [<br key={i} />, word])}
      </span>
    </button>
  );
});

export default NavButton;
