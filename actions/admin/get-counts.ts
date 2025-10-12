'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';

export const getCounts = async () => {
  const session = await auth();

  const isAdmin = session?.user?.role === 'ADMIN';

  if (!isAdmin) {
    return { error: 'Error fetching counts' };
  }

  try {
    const [usersCount, blogsCount] = await Promise.all([db.user.count(), db.blog.count()]);

    return { success: { usersCount, blogsCount } };
  } catch (error) {
    return { error: 'Error fetching counts' };
  }
};
