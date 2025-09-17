'use client';

import Button from '@/components/common/button';
import { FollowedStatus } from '@/shared/enum/followed-status.enum';
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

const FollowButton = ({
  user,
  isFollowing: isFollowingByDefault,
  isList = false,
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(isFollowingByDefault);
  const [loading, setLoading] = useState(false);
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
      } else if (res.data.success === FollowedStatus.UNFOLLOWED) {
        setIsFollowing(false);
      }

      router.refresh();
    } catch (ex: { response: { data: { error: string } } }) {
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
