import { z } from 'zod';

export const BlogSchema = z.object({
  title: z
    .string()
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(150, { message: 'Title must be at most 150 characters' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters' }),
  coverImage: z.string().optional(),
  isPublished: z.boolean(),
  tags: z.array(z.string()),
});

export type BlogSchemaType = z.infer<typeof BlogSchema>;
