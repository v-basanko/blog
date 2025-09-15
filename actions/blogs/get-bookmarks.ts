'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { PaginationParams } from '@/shared/types/pagination-params';
import { Blog, Bookmark } from '@prisma/client';

export const getBookmarks = async ({ page = 1, limit = 5 }: PaginationParams) => {
  const skip = (page - 1) * limit;

  const session = await auth();
  const userId = session?.user?.userId;

  if (!userId) {
    return { error: 'User not authenticated!' };
  }

  try {
    const bookmarks = await db.bookmark.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId,
      },
      include: {
        blog: {
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
        },
      },
    });

    const blogs = bookmarks
      .filter((bookmark: Bookmark & { blog: Blog }) => bookmark.blog !== null)
      .map((bookmark: Bookmark & { blog: Blog }) => bookmark.blog);

    const totalBookmarksCount = await db.bookmark.count({
      where: {
        userId,
      },
    });

    const hasMore = page * limit < totalBookmarksCount;

    return { success: { blogs, hasMore } };
  } catch (e) {
    return { error: 'Error fetching bookmarks!' };
  }
};
