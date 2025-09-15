'use server';

import { db } from '@/lib/db';
import { PaginationParams } from '@/shared/types/pagination-params';
import { ParamUserId } from '@/shared/types/param-user-id';

export type GetBlogsByUserIdParams = PaginationParams & ParamUserId;

export const getBlogsByUserId = async ({ page = 1, limit = 5, userId }: GetBlogsByUserIdParams) => {
  const skip = (page - 1) * limit;

  try {
    const blogs = await db.blog.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId,
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
        userId,
      },
    });

    const hasMore = page * limit < totalBlogsCount;

    return { success: { blogs, hasMore } };
  } catch (e) {
    return { error: 'Error fetching blogs!' };
  }
};
