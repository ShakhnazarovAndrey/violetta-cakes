import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Начинки: для тортов и для бенто-тортов (type).
const fillings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fillings' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      type: z.enum(['торт', 'бенто']),
      description: z.string().optional(),
      note: z.string().optional(),
      image: image(),
      order: z.number().default(100),
    }),
});

// Что можно заказать: торты и бенто.
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      badge: z.string(),
      text: z.string(),
      image: image(),
      link: z.string(),
      order: z.number().default(100),
    }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: ({ image }) =>
    z.object({
      author: z.string(),
      occasion: z.string().optional(),
      text: z.string(),
      image: image().optional(),
      order: z.number().default(100),
    }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(100),
  }),
});

export const collections = { fillings, products, reviews, faq };
