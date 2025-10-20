import BlogCardSkeleton from '@/components/blog/blog-card-skeleton';
import Skeleton from '@/components/common/skeleton';
import Container from '@/components/layout/container';

const BookmarksLoading = () => {
  return (
    <Container>
      <div className="max-w-[800px] m-auto mt-4 px-4">
        {/* Heading Skeleton */}
        <Skeleton className="w-48 h-10 mb-6" />
      </div>

      <div className="flex flex-col max-w-[800px] m-auto justify-start min-h-[85vh] px-4 pt-2">
        <section>
          {/* Show 5 skeleton cards */}
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </section>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-4 py-8">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
      </div>
    </Container>
  );
};

export default BookmarksLoading;
