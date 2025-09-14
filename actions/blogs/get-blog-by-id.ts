'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';

export const getBlogById = async ({ blogId }: { blogId: string }) => {
  if (!blogId) {
    return { error: 'Blog id is required' };
  }

  const session = await auth();
  const userId = session?.user?.id;

  try {
    const blog = await db.blog.findUnique({
      where: {
        id: blogId,
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
  } catch (ex) {
    return { error: 'Error fetching blog!' };
  }
};
