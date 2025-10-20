'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';

export const getBlogById = async (id: string) => {
  if (!id) {
    return { error: 'Blog id is required' };
  }

  const session = await auth();
  const userId = session?.user?.userId;

  try {
    const blog = await db.blog.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            claps: true,
            comments: true,
          },
        },
        claps: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
        bookmarks: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return { success: blog };
  } catch {
    return { error: 'Error fetching blog!' };
  }
};
