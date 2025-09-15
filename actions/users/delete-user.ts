'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { backendClient } from '@/lib/edgestore-server';
import { getUserById } from '@/lib/user';
import { Blog } from '@prisma/client';

export const deleteUser = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    return {
      error: 'User not found',
    };
  }

  const session = await auth();

  if (session?.user?.userId !== user.id) {
    return {
      error: 'You are not authorized to delete this user',
    };
  }

  const blogs = await db.blog.findMany({
    where: {
      userId: user.id,
    },
  });

  if (!!blogs.length) {
    await Promise.all(
      blogs.map(async (blog: Blog) => {
        if (blog.coverImage) {
          try {
            await backendClient.publicFiles.deleteFile({ url: blog.coverImage });
          } catch (e) {
            console.error(`Error deleting file:`, e);
          }
        }
      }),
    );
  }

  try {
    await db.user.delete({
      where: { id: user.id },
    });
  } catch (e) {
    return { error: 'Error deleting user' };
  }

  return { success: 'User deleted successfully' };
};
