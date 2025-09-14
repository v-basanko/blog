import { auth } from '@/auth';
import { BlogWithUser } from '@/components/blog/list-blogs';
import Reactions from '@/components/blog/reactions';
import UserSummary from '@/components/blog/user-summary';
import Tag from '@/components/common/tag';
import Image from 'next/image';
import Link from 'next/link';

const BlogCard = async ({
  blog,
  isUserProfile,
}: {
  blog: BlogWithUser;
  isUserProfile: boolean;
}) => {
  const session = await auth();
  const userId = session?.user?.userId;
  const isOwner = userId === blog.userId;
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="border-b border-slate-300 dark: border-slate-700 py-6 cursor-pointer">
      <div className="flex items-center justify-between">
        {blog.user && <UserSummary user={blog.user} createdDate={blog.createdAt} />}
        {isOwner && isUserProfile && !blog.isPublished && <p className="text-rose-500">Draft</p>}
        {(isOwner || isAdmin) && isUserProfile && (
          <Link className="text-orange-400" href={`/blog/edit/${blog.id}`}>
            Edit
          </Link>
        )}
      </div>
      <div className="my-2 flex justify-between gap-6">
        <div className="flex flex-col justify-between w-full">
          <Link href={`/blog/details/${blog.id}`} className="text-3xl sm:text-2x1 font-bold">
            {blog.title}
          </Link>
          {blog.tags.length > 0 && (
            <div className="flex gap-4 items-center flex-wrap mb-2">
              {blog.tags.map((tag) => {
                return <Tag key={blog.id + tag}>{tag}</Tag>;
              })}
            </div>
          )}
          <Reactions blog={blog} />
        </div>
        {blog.coverImage && (
          <Link
            href={`/blog/details/${blog.id}`}
            className="w-full max-w-[160px] h-[100px] relative overflow-hidden"
          >
            <Image src={blog.coverImage} fill alt={blog.title} className="object-cover" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
