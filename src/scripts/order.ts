import { site } from '../data/site';

const { whatsapp, telegram } = site.contacts;

export function orderText(filling?: string, kind = 'торт') {
  const what = filling ? `${kind} с начинкой «${filling}»` : kind;
  return `Здравствуйте, ${site.name}! Хочу заказать ${what}.\nДата: \nВес: кг\nПожелания по декору: `;
}

let toastTimer: number | undefined;
export function toast(message: string) {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-visible'), 3200);
}

// Ссылки на мессенджеры собираем в момент клика, чтобы подставить начинку.
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-order]');
  if (!link) return;
  const text = orderText(link.dataset.filling, link.dataset.kind);
  link.target = '_blank';
  link.rel = 'noopener';

  if (link.dataset.order === 'wa') {
    link.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  } else if (link.dataset.order === 'tg' && telegram) {
    // в личку Telegram нельзя передать текст, поэтому копируем его в буфер
    link.href = `https://t.me/${telegram}`;
    navigator.clipboard?.writeText(text).then(
      () => toast('Текст заказа скопирован — вставьте его в чат'),
      () => {},
    );
  }
});
