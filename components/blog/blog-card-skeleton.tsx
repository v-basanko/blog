import Skeleton from '@/components/common/skeleton';

const BlogCardSkeleton = () => {
  return (
    <div className="border-b border-slate-300 dark:border-slate-700 py-6">
      {/* User Summary Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-24 h-3" />
        </div>
      </div>

      {/* Blog Content Skeleton */}
      <div className="my-2 flex justify-between gap-6">
        <div className="flex flex-col justify-between w-full gap-3">
          {/* Title */}
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-3/4 h-8" />

          {/* Tags */}
          <div className="flex gap-4 items-center flex-wrap mb-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
          </div>

          {/* Reactions */}
          <div className="flex gap-4 items-center">
            <Skeleton className="w-12 h-6" />
            <Skeleton className="w-12 h-6" />
            <Skeleton className="w-12 h-6" />
          </div>
        </div>

        {/* Cover Image Skeleton */}
        <Skeleton className="w-full max-w-[160px] h-[100px]" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
