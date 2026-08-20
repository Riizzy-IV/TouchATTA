import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './VideoOverlay.module.css';

function toYouTubeEmbed(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
}

export default function VideoOverlay({ src, onClose }) {
  const overlayRef = useRef(null);
  const mediaRef   = useRef(null);

  const embedUrl  = toYouTubeEmbed(src ?? '');
  const isYouTube = !!embedUrl;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(overlayRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' });
      gsap.from(mediaRef.current,   { opacity: 0, y: 30, duration: 0.45, delay: 0.1, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, []);

  function handleClose() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onClose });
  }

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={handleClose}>
      <div className={styles.wrapper} onClick={e => e.stopPropagation()}>
        {isYouTube ? (
          <iframe
            ref={mediaRef}
            className={styles.iframe}
            src={embedUrl}
            title="Vídeo"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        ) : (
          <video
            ref={mediaRef}
            className={styles.video}
            src={src}
            controls
            autoPlay
            disablePictureInPicture
            controlsList="nodownload"
            onEnded={handleClose}
          />
        )}
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar vídeo">✕</button>
      </div>
    </div>
  );
}
