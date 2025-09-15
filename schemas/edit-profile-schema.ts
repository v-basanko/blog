import { z } from 'zod';

export const EditProfileSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters' })
    .max(30, { message: 'Name must be at most 30 characters' }),
  email: z.string().email(),
  bio: z.string().optional(),
  tags: z.array(z.string()),
});

export type EditProfileSchemaType = z.infer<typeof EditProfileSchema>;
