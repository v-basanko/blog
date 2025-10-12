'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NotificationType } from '@/shared/enum/notification-type.enum';
import { LatestNotification } from '@/shared/types/latest-notification';

export const getNotifications = async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'User not authenticated',
    };
  }

  const userId = session.user.userId;

  try {
    const notifications = await db.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            blogId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    const unreadNotificationsCount = await db.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });

    const formattedNotifications = notifications.map((notification: LatestNotification) => {
      let content = '';

      switch (notification.type) {
        case NotificationType.NEW_COMMENT:
          content = `${notification.sender.name || 'Someone'} commented on your blog "${notification.blog?.title}"`;
          break;
        case NotificationType.COMMENT_REPLY:
          content = `${notification.sender.name || 'Someone'} replied to your comment on "${notification.comment?.content}"`;
          break;
        case NotificationType.NEW_CLAP:
          content = `${notification.sender.name || 'Someone'} clapped on your blog "${notification.blog?.title}"`;
          break;
        case NotificationType.FOLLOW:
          content = `${notification.sender.name || 'Someone'} started following you`;
          break;
        case NotificationType.SYSTEM_ALERT:
          content = `System Alert: ${notification.content}`;
          break;
        default:
          content = `New notification from ${notification.sender.name || 'Unknown'}`;
          break;
      }

      return {
        ...notification,
        content,
      };
    });

    return {
      success: {
        notifications: formattedNotifications,
        unreadNotificationsCount,
      },
    };
  } catch (ex) {
    console.log(ex);
    return {
      error: 'Error fetching notifications!',
    };
  }
};
