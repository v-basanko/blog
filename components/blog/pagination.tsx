'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import queryString from 'query-string';

interface ListBlogsProps {
  hasMore: boolean;
  currentPage: number;
  isUserProfile?: boolean;
}

const Pagination = ({ hasMore, currentPage, isUserProfile }: ListBlogsProps) => {
  const searchParams = useSearchParams();
  const params = useParams();
  const currentQuery = queryString.parse(searchParams.toString());

  const searchParamsUrl = queryString.stringify({ url: '', query: currentQuery.query });
  let prefix = ``;
  if (isUserProfile) {
    prefix = `/user/${params.id}`;
  } else {
    prefix = `/blog/feed`;
  }

  return (
    <div className="flex justify-between mt-4">
      {currentPage > 1 && (
        <Link href={`${prefix}/${currentPage - 1}${searchParamsUrl}`}>
          <span>Previous</span>
        </Link>
      )}
      {hasMore && (
        <Link href={`${prefix}/${currentPage + 1}${searchParamsUrl}`}>
          <span>Next</span>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
