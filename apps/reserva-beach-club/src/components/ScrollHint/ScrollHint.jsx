import { useEffect, useRef, useState } from 'react';
import styles from './ScrollHint.module.css';

const FIM_TOLERANCIA = 40;

function acharRolagem(host) {
  return [...host.querySelectorAll('*')].find((el) => {
    const { overflowY } = getComputedStyle(el);
    return (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2;
  }) ?? null;
}

/**
 * Mãozinha "role para ver mais" (mesma do Eden Sky). Fica dentro do container da página
 * (que precisa ser position: relative) e detecta sozinha o elemento que rola na vertical:
 * aparece só onde há rolagem (mobile) e some quando o fim do conteúdo é alcançado.
 * `resetKey` re-avalia quando o conteúdo troca (ex.: aba ativa).
 */
export default function ScrollHint({ resetKey }) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return undefined;

    let alvo = null;
    const avaliar = () => {
      if (!alvo || !host.contains(alvo) || alvo.scrollHeight <= alvo.clientHeight + 2) alvo = acharRolagem(host);
      setVisivel(!!alvo && alvo.scrollTop + alvo.clientHeight < alvo.scrollHeight - FIM_TOLERANCIA);
    };

    const onScroll = (e) => {
      if (e.target === alvo) avaliar();
    };

    avaliar();
    // a aba entra com animação e imagens carregam depois: reavalia
    const timers = [200, 600, 1400].map((ms) => setTimeout(avaliar, ms));

    host.addEventListener('scroll', onScroll, true);
    host.addEventListener('load', avaliar, true);
    window.addEventListener('resize', avaliar);

    return () => {
      timers.forEach(clearTimeout);
      host.removeEventListener('scroll', onScroll, true);
      host.removeEventListener('load', avaliar, true);
      window.removeEventListener('resize', avaliar);
    };
  }, [resetKey]);

  return (
    <img
      ref={ref}
      src="/img/guidance-hand.gif"
      alt=""
      className={`${styles.dica} ${visivel ? '' : styles.oculta}`}
      draggable={false}
    />
  );
}
