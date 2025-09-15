import { getBookmarks } from '@/actions/blogs/get-bookmarks';
import ListBlogs from '@/components/blog/list-blogs';
import Alert from '@/components/common/alert';
import Heading from '@/components/common/heading';
import Container from '@/components/layout/container';
import { ParamPage } from '@/shared/types/param-page';

interface BookmarksProps {
  params: Promise<ParamPage>;
}

const Bookmarks = async ({ params }: BookmarksProps) => {
  const { page } = await params;

  const currentPage = parseInt(page, 10) || 1;

  const { success, error } = await getBookmarks({ page: currentPage, limit: 5 });

  if (error) {
    return <Alert error message="Error fetching bookmarks!" />;
  }

  if (!success) {
    return <Alert message="No blogs found!" />;
  }

  return (
    <Container>
      <div className="max-w-[800px] m-auto mt-4 px-4">
        <Heading title="Bookmarks" lg />
      </div>
      <ListBlogs blogs={success.blogs} currentPage={currentPage} hasMore={success.hasMore} />
    </Container>
  );
};

export default Bookmarks;
