// src/content/config.ts
import { z } from 'zod';
declare function defineCollection<T = any>(input: T): T;

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // 使用 coerce.date() 兼容各种日期格式字符串
    date: z.coerce.date().optional(), 
    cover: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};