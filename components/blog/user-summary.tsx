'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@prisma/client';
import { UserRound } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';

export interface UserSummaryProps {
  user: Pick<User, 'id' | 'name' | 'image'>;
  createdDate?: Date | null;
}

const UserSummary = ({ user, createdDate }: UserSummaryProps) => {
  return (
    <Link className="flex gap-4" href={`/user/${user.id}/1`}>
      <Avatar className="w-6 h-6">
        <AvatarImage src={user?.image || ''} />
        <AvatarFallback className="border-2 border-slate-500 dark:border-slate-50">
          <UserRound />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2 text-sm">
        <p className="text-sm">{user.name}</p>
        {createdDate && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {moment(new Date(createdDate)).fromNow()}
          </p>
        )}
      </div>
    </Link>
  );
};

export default UserSummary;
