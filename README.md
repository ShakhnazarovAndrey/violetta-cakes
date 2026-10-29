# Violetta — сайт-визитка кондитера

Astro + GSAP + Lenis, статика для Vercel.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # готовый сайт в dist/
```

## Где менять контент

| Что | Где |
|---|---|
| Имя, город, контакты, тексты «обо мне», шаги заказа, десерт месяца | `src/data/site.ts` |
| Начинки (название, цена/кг, состав, фото) | `src/content/fillings/*.md` |
| Что можно заказать | `src/content/products/*.md` |
| Отзывы | `src/content/reviews/*.md` |
| Вопросы-ответы | `src/content/faq/*.md` |
| Фото работ | просто положить файлы в `src/assets/gallery/` |

Фото начинки: положить файл в `src/assets/fillings/` и добавить в md-файл строку
`image: ../../assets/fillings/имя-файла.png` — вместо иллюстрации появится фото.
Пока фото нет, срез рисуется по цветам слоёв (`layers`, `cream`, `topping`).

## Публикация

Сайт собирается и выкладывается на GitHub Pages автоматически при каждом пуше в `main`
(`.github/workflows/deploy.yml`). Адрес: `https://<логин>.github.io/violetta-cakes/`.

Адрес и подпуть берутся из переменных `SITE_URL` и `BASE_PATH`. Без них (локально, на Vercel,
на своём домене) сайт собирается для корня `/`.

Пока в контенте есть заглушки, сайт закрыт от поисковиков (`noindex` в `src/layouts/Base.astro`).
Когда данные будут настоящими — поставить `noindex = false`.
