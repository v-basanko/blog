import BlogCardSkeleton from '@/components/blog/blog-card-skeleton';
import Container from '@/components/layout/container';

const BlogFeedLoading = () => {
  return (
    <Container>
      <div className="flex flex-col max-w-[800px] m-auto justify-start min-h-[85vh] px-4 pt-2">
        <section>
          {/* Show 5 skeleton cards */}
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </section>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-4 py-8">
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded w-24 h-10" />
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded w-24 h-10" />
        </div>
      </div>
    </Container>
  );
};

export default BlogFeedLoading;
