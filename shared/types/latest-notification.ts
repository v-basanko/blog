import { Blog, Comment, Notification, User } from '@prisma/client';

export type LatestNotification = Notification & {
  sender: Pick<User, 'id' | 'name'>;
  blog?: Pick<Blog, 'id' | 'title'>;
  comment?: Pick<Comment, 'id' | 'content' | 'blogId'>;
};
