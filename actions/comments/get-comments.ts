'use server';

import { db } from '@/lib/db';

type GetCommentsProps = {
  blogId: string;
  parentId: string | null;
  userId?: string;
};

const getComments = async ({ blogId, parentId, userId }: GetCommentsProps) => {
  const blog = await db.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    return {
      error: 'Blog not found',
    };
  }

  try {
    const comments = await db.comment.findMany({
      where: {
        blogId,
        ...(parentId ? { parentId } : {}),
      },
      orderBy: {
        createdAt: parentId ? 'asc' : 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        repliedToUser: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            replies: true,
            claps: true,
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
      },
    });

    return { success: { comments } };
  } catch {
    return {
      error: 'Something went wrong',
    };
  }
};

export default getComments;
