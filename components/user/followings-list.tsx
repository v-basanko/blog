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

type FollowingListProps = {
  user: UserWithFollows;
};

const FollowingsList = ({ user }: FollowingListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <span>{user._count.followings} Followings</span>
        </DialogTrigger>
        <DialogContent className="max-w-[500px] w-[90%]">
          <DialogHeader>
            <DialogTitle>Followings</DialogTitle>
          </DialogHeader>
          <div>
            {user.followings.map((item) => {
              return (
                <div key={item.following.id} className="flex gap-8 items-center justify-between">
                  <UserSummary user={item.following} />
                  <FollowButton
                    user={item.following}
                    isFollowing={!!item.following.followers.length}
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

export default FollowingsList;
