import { getBlogById } from '@/actions/blogs/get-blog-by-id';
import CreateBlogForm from '@/components/blog/create-blog-form';
import Alert from '@/components/common/alert';
import Container from '@/components/layout/container';
import { ParamId } from '@/shared/types/param-id';

interface BlogEditPageProps {
  params: Promise<ParamId>;
}

const BlogEditPage = async ({ params }: BlogEditPageProps) => {
  const { id } = await params;

  const res = await getBlogById(id);

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
