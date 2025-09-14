import { getBlogById } from '@/actions/blogs/get-blog-by-id';
import CreateBlogForm from '@/components/blog/create-blog-form';
import Alert from '@/components/common/alert';
import Container from '@/components/layout/container';

interface BlogEditPageProps {
  params: Promise<{ id: string }>;
}

const BlogEditPage = async ({ params }: BlogEditPageProps) => {
  const { id } = await params;

  const res = await getBlogById({ blogId: id });

  if (!res.success) {
    return <Alert error message="Blog not found" />;
  }

  const blog = res.success;

  return (
    <Container>
      <CreateBlogForm blog={blog} />
    </Container>
  );
};

export default BlogEditPage;
