'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { PaginationParams } from '@/shared/types/pagination-params';

export type GetPublishedBlogsParams = PaginationParams & {
  searchObj: { tag: string; title: string };
};

export const getPublishedBlogs = async ({
  page = 1,
  limit = 5,
  searchObj,
}: GetPublishedBlogsParams) => {
  const skip = (page - 1) * limit;
  const { tag, title } = searchObj;

  const session = await auth();
  const userId = session?.user?.userId;

  try {
    const blogs = await db.blog.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        isPublished: true,
        ...(tag ? { tags: { has: tag } } : {}),
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

    const totalBlogsCount = await db.blog.count({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        isPublished: true,
        ...(tag ? { tags: { has: tag } } : {}),
      },
    });

    const hasMore = page * limit < totalBlogsCount;

    return { success: { blogs, hasMore } };
  } catch (e) {
    return { error: 'Error fetching blogs!' };
  }
};
