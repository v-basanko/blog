'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getUserById } from '@/lib/user';
import { BlogSchema, BlogSchemaType } from '@/schemas/blog-schema';

export const createBlog = async (data: BlogSchemaType) => {
  const session = await auth();
  const userId = session?.user?.userId;
  if (!userId) return { error: 'Unauthorized' };

  const validateFields = BlogSchema.safeParse(data);

  if (!validateFields.success) {
    return { error: 'Invalid blog data!' };
  }

  const { isPublished } = validateFields.data;

  const user = await getUserById(userId);

  if (!user) {
    return { error: 'User not found!' };
  }

  if (isPublished && !user.emailVerified) {
    return { error: 'User email is not verified!' };
  }

  await db.blog.create({
    data: {
      ...validateFields.data,
      userId,
    },
  });

  return { success: 'Blog created!' };
};
