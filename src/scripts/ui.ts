// Интерактив без анимаций: фильтр, модалки, лайтбокс, карусель, липкая кнопка.

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];

function openDialog(d: HTMLDialogElement) {
  d.showModal();
  document.dispatchEvent(new CustomEvent('modal:open'));
}
function closeDialog(d: HTMLDialogElement) {
  d.close();
}

// общие правила для всех диалогов: кнопка закрытия, клик по фону
for (const d of $$<HTMLDialogElement>('dialog')) {
  d.addEventListener('close', () => document.dispatchEvent(new CustomEvent('modal:close')));
  d.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === d || t.closest('[data-close]') || t.matches('[data-lightbox-stage]')) closeDialog(d);
  });
}

// модалка начинки
const fDialog = $<HTMLDialogElement>('[data-filling-dialog]');
const fContent = $('[data-filling-content]');
$$('[data-open-filling]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const tpl = $<HTMLTemplateElement>(`[data-filling-tpl="${btn.dataset.openFilling}"]`);
    if (!tpl || !fDialog || !fContent) return;
    fContent.replaceChildren(tpl.content.cloneNode(true));
    openDialog(fDialog);
  }),
);
// клик «написать» внутри модалки закрывает её
fContent?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a') && fDialog) setTimeout(() => closeDialog(fDialog), 200);
});

// лайтбокс галереи
const lb = $<HTMLDialogElement>('[data-lightbox-dialog]');
const stage = $('[data-lightbox-stage]');
const items = $$<HTMLButtonElement>('[data-lightbox]');
let current = 0;
function show(i: number) {
  if (!stage) return;
  current = (i + items.length) % items.length;
  const src = items[current];
  const img = src.querySelector('img');
  let node: HTMLElement;
  if (img) {
    node = img.cloneNode() as HTMLImageElement;
    node.setAttribute('sizes', '92vw');
    node.removeAttribute('loading');
  } else {
    node = document.createElement('div');
    node.className = src.className;
    node.setAttribute('style', src.getAttribute('style') ?? '');
    node.innerHTML = src.innerHTML;
  }
  stage.replaceChildren(node);
}
items.forEach((btn, i) =>
  btn.addEventListener('click', () => {
    if (!lb) return;
    show(i);
    openDialog(lb);
  }),
);
$('[data-lightbox-prev]')?.addEventListener('click', () => show(current - 1));
$('[data-lightbox-next]')?.addEventListener('click', () => show(current + 1));
lb?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// карусель отзывов
const track = $('[data-carousel]');
function step(dir: number) {
  if (!track) return;
  const card = track.querySelector<HTMLElement>('li');
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  track.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + gap), behavior: 'smooth' });
}
$('[data-carousel-prev]')?.addEventListener('click', () => step(-1));
$('[data-carousel-next]')?.addEventListener('click', () => step(1));

// мобильная липкая кнопка: видна после hero и прячется у контактов
const sticky = $('[data-sticky]');
if (sticky) {
  const state = { hero: true, contacts: false };
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.target.id === 'top') state.hero = en.isIntersecting;
      if (en.target.id === 'contacts') state.contacts = en.isIntersecting;
    }
    sticky.classList.toggle('is-visible', !state.hero && !state.contacts);
  });
  ['#top', '#contacts'].forEach((s) => {
    const el = $(s);
    if (el) io.observe(el);
  });
}
