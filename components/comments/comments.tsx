import getComments from '@/actions/comments/get-comments';
import { auth } from '@/auth';
import { BlogWithUser } from '@/components/blog/list-blogs';
import AddCommentsForm from '@/components/comments/add-comments-form';
import ListComments from '@/components/comments/list-comments';
import Heading from '@/components/common/heading';

type CommentsProps = {
  blog: BlogWithUser;
};

const Comments = async ({ blog }: CommentsProps) => {
  const data = await auth();

  const userId = data?.user.userId;

  const { success } = await getComments({ blogId: blog.id, parentId: null, userId });

  return (
    <div>
      <Heading title="Comments" />
      {userId && <AddCommentsForm blogId={blog.id} creatorId={blog.userId} />}
      {!!success?.comments.length && <ListComments comments={success.comments} />}
    </div>
  );
};

export default Comments;
