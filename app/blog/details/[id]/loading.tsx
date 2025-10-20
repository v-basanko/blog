import Skeleton from '@/components/common/skeleton';
import Container from '@/components/layout/container';
import { Separator } from '@/components/ui/separator';

const BlogDetailsLoading = () => {
  return (
    <Container>
      <div className="flex flex-col max-w-[900px] m-auto gap-6">
        {/* Cover Image Skeleton */}
        <Skeleton className="relative w-full h-[35vh] mt-2" />

        {/* User Summary Skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <Skeleton className="w-12 h-6" />
        </div>

        {/* Reactions Skeleton */}
        <div className="flex flex-col gap-2">
          <Separator />
          <div className="flex gap-4 items-center">
            <Skeleton className="w-16 h-8" />
            <Skeleton className="w-16 h-8" />
            <Skeleton className="w-16 h-8" />
          </div>
          <Separator />
        </div>

        {/* Title Skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-3/4 h-12" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-4 items-center flex-wrap">
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="w-16 h-8 rounded-full" />
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-5/6 h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-4/5 h-6" />
          <Skeleton className="w-full h-40 mt-4" />
          <Skeleton className="w-full h-6 mt-4" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-3/4 h-6" />
        </div>

        <Separator />

        {/* Comments Section Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    </Container>
  );
};

export default BlogDetailsLoading;
