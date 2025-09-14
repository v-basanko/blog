'use server';

import { getBlogById } from '@/actions/blogs/get-blog-by-id';
import { auth } from '@/auth';
import BlogContent from '@/components/blog/blog-content';
import Alert from '@/components/common/alert';
import Container from '@/components/layout/container';

interface BlogContentPageProps {
  params: Promise<{ id: string }>;
}

const BlogContentPage = async ({ params }: BlogContentPageProps) => {
  const session = await auth();

  const { id } = await params;

  const res = await getBlogById({ blogId: id });

  if (!res.success) {
    return <Alert error message="Blog not found" />;
  }

  const blog = res.success;

  if (!blog) {
    return <Alert error message="Blog not found" />;
  }

  return (
    <Container>
      <BlogContent
        blog={blog}
        canEdit={session?.user.userId === blog.userId}
        createdAt={blog.createdAt}
      />
    </Container>
  );
};

export default BlogContentPage;
