import CommentCard from '@/components/comments/comment-card';
import { Comment, User } from '@prisma/client';

export type CommentWithUser = Comment & {
  user: Pick<User, 'id' | 'name' | 'image'>;
  repliedToUser: Pick<User, 'id' | 'name'> | null;
  _count: {
    replies: number;
    claps: number;
  };
  claps: {
    id: string;
  }[];
};

type ListCommentsProps = {
  comments: CommentWithUser[];
};

const ListComments = ({ comments }: ListCommentsProps) => {
  return (
    <div className="mt-4" id="comments">
      {comments.map((comment) => {
        return (
          <div key={comment.id} id={comment.id}>
            <CommentCard comment={comment} />
          </div>
        );
      })}
    </div>
  );
};

export default ListComments;
