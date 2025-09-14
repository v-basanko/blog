'use server';

import { db } from '@/lib/db';
import { getUserById } from '@/lib/user';
import { CommentSchema, CommentSchemaType } from '@/schemas/comment-schema';
import { revalidatePath } from 'next/cache';

type AddCommentParams = {
  values: CommentSchemaType;
  userId: string;
  blogId: string;
  repliedToUserId?: string;
  parentId?: string;
};

export const addComment = async ({
  values,
  userId,
  blogId,
  repliedToUserId,
  parentId,
}: AddCommentParams) => {
  const vFields = CommentSchema.safeParse(values);

  if (!vFields.success) {
    return {
      error: 'Invalid fields',
    };
  }

  const { content } = vFields.data;

  const user = await getUserById(userId);

  if (!user) {
    return {
      error: 'User not found',
    };
  }

  const blog = await db.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    return {
      error: 'Blog not found',
    };
  }

  if (parentId) {
    const parentComment = await db.comment.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parentComment) {
      return {
        error: 'Parent comment not found',
      };
    }
  }

  if (repliedToUserId) {
    const repliedToComment = await getUserById(repliedToUserId);

    if (!repliedToComment) {
      return {
        error: 'Replied to comment not found',
      };
    }
  }

  await db.comment.create({
    data: {
      userId,
      blogId,
      content,
      repliedToUserId,
      parentId,
    },
  });

  revalidatePath(`/blog/${blogId}`);

  return { success: 'Comment added' };
};
