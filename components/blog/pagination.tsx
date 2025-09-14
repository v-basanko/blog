'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import queryString from 'query-string';

interface ListBlogsProps {
  hasMore: boolean;
  currentPage: number;
}

const Pagination = ({ hasMore, currentPage }: ListBlogsProps) => {
  const params = useSearchParams();
  const currentQuery = queryString.parse(params.toString());

  const searchParams = queryString.stringify({ url: '', query: currentQuery.query });

  return (
    <div className="flex justify-between mt-4">
      {currentPage > 1 && (
        <Link href={`/blog/feed/${currentPage - 1}`}>
          <span>Previous</span>
        </Link>
      )}
      {hasMore && (
        <Link href={`/blog/feed/${currentPage + 1}`}>
          <span>Next</span>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
