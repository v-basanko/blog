import BlogCardSkeleton from '@/components/blog/blog-card-skeleton';
import Skeleton from '@/components/common/skeleton';

const UserProfileLoading = () => {
  return (
    <div className="max-w-[1200px] m-auto p-4">
      {/* Header Section */}
      <div className="flex gap-6 justify-between">
        <div className="flex items-start sm:items-center gap-6 flex-col sm:flex-row">
          {/* Avatar */}
          <Skeleton className="w-20 h-20 rounded-full" />

          {/* User Info */}
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-64 h-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-24 h-6" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Skeleton className="w-24 h-10" />
      </div>

      {/* User Details Section */}
      <div className="flex gap-4 flex-col items-center justify-center p-6 border-y mt-6 flex-wrap">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-56 h-8" />
        </div>
        <Skeleton className="w-64 h-6" />
      </div>

      {/* Tags Section */}
      <div className="flex items-center justify-center p-6 border-b mb-6 gap-4 flex-wrap">
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-24 h-8 rounded-full" />
        <Skeleton className="w-16 h-8 rounded-full" />
        <Skeleton className="w-28 h-8 rounded-full" />
      </div>

      {/* Blogs Section */}
      <div className="flex flex-col max-w-[800px] m-auto justify-start min-h-[50vh] px-4">
        <section>
          {Array.from({ length: 3 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </section>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-4 py-8">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileLoading;
