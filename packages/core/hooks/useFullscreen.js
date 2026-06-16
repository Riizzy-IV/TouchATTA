import { useCallback } from 'react';

export function useFullscreen() {
  const enter = useCallback(() => {
    const el = document.documentElement;
    const fn =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen;
    if (fn) fn.call(el);
  }, []);

  const exit = useCallback(() => {
    const fn =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen;
    if (fn) fn.call(document);
  }, []);

  const isFullscreen = useCallback(() => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    );
  }, []);

  return { enter, exit, isFullscreen };
}
