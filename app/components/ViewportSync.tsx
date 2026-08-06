'use client';

import { useEffect } from 'react';

export default function ViewportSync() {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = window.visualViewport?.height || window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${Math.round(height)}px`);
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sync();
        window.setTimeout(sync, 120);
        window.setTimeout(sync, 420);
      }
    };

    sync();
    window.addEventListener('resize', sync, { passive: true });
    window.addEventListener('orientationchange', sync, { passive: true });
    window.addEventListener('pageshow', sync);
    window.visualViewport?.addEventListener('resize', sync, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
      window.removeEventListener('pageshow', sync);
      window.visualViewport?.removeEventListener('resize', sync);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return null;
}
