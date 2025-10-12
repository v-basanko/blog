'use client';

import { getNotifications } from '@/actions/notifications/get-notifications';
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/actions/notifications/mark-as-read';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSocket } from '@/context/socket-context';
import { cn } from '@/lib/utils';
import { EntityType } from '@/shared/enum/entity-type.enum';
import { LatestNotification } from '@/shared/types/latest-notification';
import { Bell } from 'lucide-react';
import moment from 'moment';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Notifications = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<Array<LatestNotification>>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { refetchNotifications, handleRefetchNotifications } = useSocket();

  useEffect(() => {
    const handleFetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await getNotifications();
        if (res.success) {
          setNotifications(res.success.notifications);
          setUnreadNotificationsCount(res.success.unreadNotificationsCount);
        }

        if (res.error) {
          setError(res.error);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === 'string') {
          setError(error);
        } else {
          setError('An error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    handleFetch();
  }, [refetchNotifications]);

  useEffect(() => {
    const hash = window.location.hash;
    let timeoutId: NodeJS.Timeout | undefined;

    if (hash) {
      timeoutId = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  const handleOpen = async (n: LatestNotification) => {
    if (n.entityType === EntityType.BLOG && n.blogId) {
      router.push(`/blog/details/${n.blogId}/#comments`);
    }

    if (n.entityType === EntityType.COMMENT && n.comment?.blogId) {
      router.push(`/blog/${n.comment.blogId}/#${n.comment.id}`);
    }

    if (n.entityType === EntityType.USER && n.senderId) {
      router.push(`/user/${n.senderId}/1`);
    }

    await markNotificationAsRead(n.id);
    handleRefetchNotifications();
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
    handleRefetchNotifications();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        {unreadNotificationsCount > 0 ? (
          <div className="absolute bg-rose-500 h-6 w-6 rounded-full text-sm flex items-center justify-center bottom-2 left-2">
            <span>{unreadNotificationsCount}</span>
          </div>
        ) : (
          <></>
        )}
        <Bell size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[100%] max-w-[400px]">
        <div className="flex gap-4 justify-between mb-2 p-2">
          <h3 className="font-bold text-lg">Notifications</h3>
          <button onClick={markAllAsRead}>Mark all as read</button>
        </div>
        {isLoading && (
          <DropdownMenuItem>
            <div className="text-sm text-gray-500">Loading...</div>
          </DropdownMenuItem>
        )}
        {error && (
          <DropdownMenuItem>
            <div className="text-sm rose">{error}</div>
          </DropdownMenuItem>
        )}
        {!isLoading &&
          !error &&
          !!notifications.length &&
          notifications.map((n) => {
            return (
              <DropdownMenuItem
                onClick={() => handleOpen(n)}
                key={n.id}
                className={cn(
                  'text-sm cursor-pointer mb-4 flex flex-col items-start border',
                  !n.isRead && 'bg-secondary',
                )}
              >
                <div>{n.content}</div>
                <span className="text-xs">{moment(new Date(n.createdAt)).fromNow()}</span>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
