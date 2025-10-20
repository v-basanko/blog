import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse bg-slate-200 dark:bg-slate-700 rounded', className)}
      aria-label="Loading..."
    />
  );
};

export default Skeleton;
