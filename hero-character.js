/* トップ中央キャラクターだけがマウスに反応。クリックで Effect の SVG を散らす。 */
(() => {
  'use strict';
  const hero = document.querySelector('#home.hero');
  const art = hero?.querySelector('.art-stack');
  const character = art?.querySelector('.character-art');
  const button = art?.querySelector('.hero-character-hitbox');
  if (!hero || !art || !character || !button) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Effect.zip 内の SVG 全21種類を、クリックのたびにランダムな順で表示する。
  const effectPaths = [
    'assets/effect/burokkori.svg',
    'assets/effect/cheeze.svg',
    'assets/effect/creative.svg',
    'assets/effect/ebi.svg',
    'assets/effect/food.svg',
    'assets/effect/games.svg',
    'assets/effect/gohan.svg',
    'assets/effect/gyouza.svg',
    'assets/effect/hoshi_1.svg',
    'assets/effect/hoshi_2.svg',
    'assets/effect/hoshi_3.svg',
    'assets/effect/hotdog.svg',
    'assets/effect/kareee.svg',
    'assets/effect/kinoko.svg',
    'assets/effect/niku.svg',
    'assets/effect/oden.svg',
    'assets/effect/omuraisu.svg',
    'assets/effect/onigiri.svg',
    'assets/effect/ra-men.svg',
    'assets/effect/sushi.svg',
    'assets/effect/toumorokoshi.svg',
  ];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const reset = () => {
    character.style.setProperty('--icon-x', '0px');
    character.style.setProperty('--icon-y', '0px');
    character.style.setProperty('--icon-turn', '0deg');
    art.classList.remove('is-character-near');
  };

  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches || document.hidden) return;
    const area = button.getBoundingClientRect();
    const dx = event.clientX - (area.left + area.width / 2);
    const dy = event.clientY - (area.top + area.height / 2);
    const reach = Math.max(260, area.width * 1.9);
    const near = clamp(1 - Math.hypot(dx, dy) / reach, 0, 1);
    const influence = near * near;
    character.style.setProperty('--icon-x', `${clamp(dx * 0.18 * influence, -16, 16).toFixed(2)}px`);
    character.style.setProperty('--icon-y', `${clamp(dy * 0.13 * influence, -12, 12).toFixed(2)}px`);
    character.style.setProperty('--icon-turn', `${clamp(dx * 0.025 * influence, -3, 3).toFixed(2)}deg`);
    art.classList.toggle('is-character-near', near > 0.3);
  }, { passive: true });

  hero.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  reducedMotion.addEventListener?.('change', () => { if (reducedMotion.matches) reset(); });
  button.addEventListener('pointerenter', () => art.classList.add('is-character-hovered'));
  button.addEventListener('pointerleave', () => art.classList.remove('is-character-hovered'));

  function burst(x, y) {
    if (reducedMotion.matches) return;
    const amount = effectPaths.length;
    const distanceScale = Math.max(0.63, Math.min(1, window.innerWidth / 800));
    // 1回のクリックで全種類を1度ずつ、毎回違う順番で散らす。
    const shuffled = [...effectPaths];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement('span');
      piece.className = 'hero-food-particle';
      piece.setAttribute('aria-hidden', 'true');
      piece.style.left = `${x}px`;
      piece.style.top = `${y}px`;
      const image = document.createElement('img');
      image.src = shuffled[i];
      image.alt = '';
      image.draggable = false;
      image.decoding = 'async';
      piece.appendChild(image);
      const angle = (Math.PI * 2 * i / amount) + (Math.random() - 0.5) * 0.30;
      const distance = (105 + Math.random() * 145) * distanceScale;
      piece.style.setProperty('--particle-x', `${(Math.cos(angle) * distance).toFixed(1)}px`);
      piece.style.setProperty('--particle-y', `${(Math.sin(angle) * distance - 24).toFixed(1)}px`);
      piece.style.setProperty('--particle-rotate', `${(Math.random() * 300 - 150).toFixed(1)}deg`);
      piece.style.setProperty('--particle-size', `${Math.round((32 + Math.random() * 21) * Math.max(0.75, distanceScale))}px`);
      piece.style.setProperty('--particle-duration', `${Math.round(900 + Math.random() * 420)}ms`);
      piece.style.setProperty('--particle-delay', `${Math.round(Math.random() * 100)}ms`);
      piece.addEventListener('animationend', () => piece.remove(), { once: true });
      document.body.appendChild(piece);
      // タブ切替などでアニメーションが中断された場合も要素を残さない。
      window.setTimeout(() => piece.remove(), 1700);
    }
  }

  button.addEventListener('click', event => {
    const box = button.getBoundingClientRect();
    const isKeyboard = event.detail === 0;
    const x = isKeyboard ? box.left + box.width / 2 : event.clientX;
    const y = isKeyboard ? box.top + box.height / 2 : event.clientY;
    burst(x, y);
    if (!reducedMotion.matches) {
      character.animate([
        { scale: '1' }, { scale: '1.055', offset: 0.35 },
        { scale: '0.99', offset: 0.74 }, { scale: '1' }
      ], { duration: 420, easing: 'ease-out' });
    }
  });
})();
