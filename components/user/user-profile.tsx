import { getBlogsByUserId } from '@/actions/blogs/get-blogs-by-user-id';
import ListBlogs from '@/components/blog/list-blogs';
import Alert from '@/components/common/alert';
import Tag from '@/components/common/tag';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditProfileButton from '@/components/user/edit-profile-button';
import { ParamPage } from '@/shared/types/param-page';
import { User } from '@prisma/client';
import { Calendar, UserRound } from 'lucide-react';
import moment from 'moment';

type UserProfileProps = ParamPage & {
  user: User;
};

const UserProfile = async ({ user, page }: UserProfileProps) => {
  const currentPage = parseInt(page) || 1;
  const { success, error } = await getBlogsByUserId({
    page: currentPage,
    limit: 5,
    userId: user.id,
  });

  return (
    <div className="max-w-[1200px] m-auto p-4">
      <div className="flex gap-6 justify-between">
        <div className="flex items-start sm:items-center gap-6 flex-col sm:flex-row">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback className="border-2 border-slate-500 dark:border-slate-50">
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-3x1 font-bold">{user.name}</h1>
            {user.bio && <p>{user.bio}</p>}
            <div className="flex items-center gap-4">
              <span>Followers</span>
              <span>Following</span>
            </div>
          </div>
        </div>
        <div>
          <EditProfileButton user={user} />
        </div>
      </div>
      <div className="flex gap-4 flex-col items-center justify-center p-6 border-y mt-6 flex-wrap">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <span>
            Id: <span className="bg-secondary ml-2 py-1 px-2 rounded">{user.id}</span>
          </span>
          <span>
            Email: <span className="bg-secondary ml-2 py-1 px-2 rounded">{user.email}</span>
          </span>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <Calendar size={18} /> Member Since {moment(user.createdAt).format('MMMM Do YYYY')}
        </div>
      </div>
      <div>
        {!!user.tags.length && (
          <div className="flex items-center justify-center p-6 border-b mb-6 gap-4 flex-wrap">
            {user.tags.map((tag: string) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
      <div>
        {error && <Alert error message="Error fetching user blogs" />}
        {success && (
          <ListBlogs
            blogs={success.blogs}
            hasMore={success.hasMore}
            currentPage={currentPage}
            isUserProfile={true}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
