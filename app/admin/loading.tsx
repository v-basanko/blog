import Skeleton from '@/components/common/skeleton';
import Container from '@/components/layout/container';

const AdminLoading = () => {
  return (
    <Container>
      <div>
        {/* Heading Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="w-48 h-12" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="flex items-center flex-wrap justify-center mt-12 gap-12">
          {/* Users Card */}
          <div className="flex flex-col items-center gap-2 border rounded-sm px-12 py-8">
            <Skeleton className="w-20 h-12" />
            <Skeleton className="w-16 h-6" />
          </div>

          {/* Blogs Card */}
          <div className="flex flex-col items-center gap-2 border rounded-sm px-12 py-8">
            <Skeleton className="w-20 h-12" />
            <Skeleton className="w-16 h-6" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AdminLoading;
