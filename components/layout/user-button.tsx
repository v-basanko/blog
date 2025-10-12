'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/shared/enum/user-role.enum';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { LogOut, Pencil, Shield, User, UserRound } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaRegBookmark } from 'react-icons/fa';

const UserButton = () => {
  const session = useSession();
  const isAdmin = session.data?.user.role === UserRole.ADMIN;
  const router = useRouter();
  const imageUrl = session.data?.user?.image || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="border-2 border-slate-500 dark:border-slate-50">
            <UserRound />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <button
            className="flex items-center gap-2"
            type="button"
            onClick={() => router.push(`/user/${session.data?.user.userId}/1`)}
          >
            <User size={18} /> Profile
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            className="flex items-center gap-2"
            type="button"
            onClick={() => router.push('/blog/create')}
          >
            <Pencil size={18} /> Create Post
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            className="flex items-center gap-2"
            type="button"
            onClick={() => router.push('/blog/bookmarks/1')}
          >
            <FaRegBookmark size={16} /> Bookmark
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isAdmin && (
          <>
            <DropdownMenuItem>
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2"
                type="button"
              >
                <Shield size={18} /> Admin
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <button onClick={() => signOut()} className="flex items-center gap-2" type="button">
            <LogOut size={18} /> Sign Out
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
