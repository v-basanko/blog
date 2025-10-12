'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { EntityType, NotificationType } from '@prisma/client';

type CreateNotificationProps = {
  recipientId: string;
  type: NotificationType;
  blogId?: string;
  commentId?: string;
  entityType?: EntityType;
  content?: string;
};

export const createNotification = async ({
  recipientId,
  type,
  blogId,
  commentId,
  entityType,
  content,
}: CreateNotificationProps) => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'User not authenticated',
    };
  }

  if (session?.user?.id === recipientId) {
    return {
      error: 'You cannot send notification to yourself',
    };
  }

  const recepient = await db.user.findUnique({
    where: {
      id: recipientId,
    },
  });

  if (!recepient) {
    return {
      error: 'Recipient not found',
    };
  }

  await db.notification.create({
    data: {
      senderId: session.user.userId,
      recipientId,
      type,
      blogId,
      commentId,
      entityType,
      content,
    },
  });

  return { success: 'Notification sent' };
};
