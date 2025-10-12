'use client';

import { createNotification } from '@/actions/notifications/create-notification';
import Button from '@/components/common/button';
import { useSocket } from '@/context/socket-context';
import { EntityType } from '@/shared/enum/entity-type.enum';
import { FollowedStatus } from '@/shared/enum/followed-status.enum';
import { NotificationType } from '@/shared/enum/notification-type.enum';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type FollowButtonProps = {
  user: User | Pick<User, 'id' | 'name' | 'image'>;
  isFollowing: boolean;
  isList?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
type FollowError = { response: { data: { error: string } } } | any;

const FollowButton = ({
  user,
  isFollowing: isFollowingByDefault,
  isList = false,
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(isFollowingByDefault);
  const [loading, setLoading] = useState(false);
  const { sendNotification } = useSocket();
  const router = useRouter();

  useEffect(() => {
    setIsFollowing(isFollowingByDefault);
  }, [isFollowingByDefault]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/follow', {
        followId: user.id,
      });

      if (res.data.success === FollowedStatus.FOLLOWED) {
        setIsFollowing(true);
        if (user.id) {
          await createNotification({
            recipientId: user.id,
            type: NotificationType.FOLLOW,
            entityType: EntityType.USER,
          });

          sendNotification(user.id);
        }
      } else if (res.data.success === FollowedStatus.UNFOLLOWED) {
        setIsFollowing(false);
      }

      router.refresh();
    } catch (ex: FollowError) {
      if (ex && ex.response && ex.response.data && ex.response.data.error) {
        toast.error(ex.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      outlined
      label={loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
      disabled={loading}
      onClick={handleFollow}
      small={isList}
    />
  );
};

export default FollowButton;
