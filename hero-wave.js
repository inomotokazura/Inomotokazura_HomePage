/* SVGの升目は、マウス位置に関係なくゆっくり波打つ。 */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const svg = hero?.querySelector('.hero-wave-svg');
  if (!hero || !svg) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = true;
  const syncPlayback = () => {
    const shouldPlay = !reducedMotion.matches && inView && !document.hidden;
    if (shouldPlay) svg.unpauseAnimations?.();
    else svg.pauseAnimations?.();
  };

  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener?.('change', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false;
      syncPlayback();
    }, { threshold: 0 }).observe(hero);
  }
  syncPlayback();
})();
