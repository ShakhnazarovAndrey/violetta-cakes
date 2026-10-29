import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

declare global {
  interface Window { __animReady?: boolean }
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
window.__animReady = true;

if (!reduce) init();

function init() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const $$ = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s);
  const isMobile = matchMedia('(max-width: 820px)').matches;

  // плавный скролл, синхронизированный с ScrollTrigger
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -16 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('modal:open', () => lenis.stop());
  document.addEventListener('modal:close', () => lenis.start());
  document.addEventListener('layout:change', () => ScrollTrigger.refresh());
  // шрифты и картинки меняют высоту страницы — пересчитываем точки срабатывания
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // интро hero: буквы вырастают из «крема»
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('.hero__letter', { yPercent: 105, rotate: 8, opacity: 0, duration: 1.3, stagger: 0.06 })
    .from('.hero__nav a', { y: 16, opacity: 0, duration: 0.8, stagger: 0.04 }, '-=0.9')
    .from('[data-hero-lead] > *', { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, '-=0.7')
    .from('[data-hero-visual]', { y: 80, rotate: 10, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.7)' }, '-=1');

  // буквы подпрыгивают при наведении
  $$('.hero__letter').forEach((l) =>
    l.addEventListener('mouseenter', () => {
      if (gsap.isTweening(l)) return;
      gsap.fromTo(l, { y: 0 }, { y: -24, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
    }),
  );

  // заголовки по словам
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      mask: 'words',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { opacity: 1 });
        return gsap.from(self.words, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });

  // появление блоков пачками
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, overwrite: true }),
  });

  // рукописные линии дорисовываются при скролле
  $$<SVGPathElement>('[data-draw]').forEach((path) => {
    path.setAttribute('pathLength', '1');
    gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: path.ownerSVGElement ?? path, start: 'top 90%', end: 'center 45%', scrub: 1 },
    });
  });

  // пунктир шагов заказа «проявляется» слева направо
  $$<SVGPathElement>('[data-draw-dashed]').forEach((path) => {
    const svg = path.ownerSVGElement!;
    gsap.fromTo(
      svg,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: svg, start: 'top 80%', end: 'bottom 40%', scrub: 1 } },
    );
  });

  // параллакс ягод
  $$('[data-parallax]').forEach((el) => {
    const k = parseFloat(el.dataset.parallax || '0') * (isMobile ? 0.5 : 1);
    gsap.to(el, {
      y: () => k * window.innerHeight,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });

  // десерт месяца мягко покачивается
  $$('[data-float]').forEach((el) =>
    gsap.to(el, { y: -14, rotate: -4, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
  );

  // лёгкий 3D-наклон карточек начинок за курсором (только мышь)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.filling__pic').forEach((card) => {
      // наклоняем содержимое, а не саму подложку: у неё свой CSS-hover
      const inner = card.firstElementChild;
      if (!inner) return;
      const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.6, ease: 'power3' });
      gsap.set(inner, { transformPerspective: 700 });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }
}
