'use client';

import { UserWithFollows } from '@/app/user/[id]/[page]/page';
import UserSummary from '@/components/blog/user-summary';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FollowButton from '@/components/user/follow-button';
import { useState } from 'react';

type FollowersListProps = {
  user: UserWithFollows;
};

const FollowersList = ({ user }: FollowersListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <span>{user._count.followers} Followers</span>
        </DialogTrigger>
        <DialogContent className="max-w-[500px] w-[90%]">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <div>
            {user.followers.map((item) => {
              return (
                <div key={item.follower.id} className="flex gap-8 items-center justify-between">
                  <UserSummary user={item.follower} />
                  <FollowButton
                    user={item.follower}
                    isFollowing={!!item.follower.followers.length}
                    isList={true}
                  />
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowersList;
