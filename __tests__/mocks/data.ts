import { Blog, Comment, Notification, User } from '@prisma/client';

export const mockUser: User = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed_password',
  emailVerified: new Date(),
  image: null,
  bio: 'Test bio',
  tags: ['javascript', 'typescript'],
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockBlog: Blog = {
  id: 'test-blog-id',
  userId: 'test-user-id',
  title: 'Test Blog Title',
  content: 'Test blog content',
  coverImage: 'https://example.com/image.jpg',
  tags: ['test', 'blog'],
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUnpublishedBlog: Blog = {
  ...mockBlog,
  id: 'unpublished-blog-id',
  isPublished: false,
};

export const mockComment: Comment = {
  id: 'test-comment-id',
  userId: 'test-user-id',
  blogId: 'test-blog-id',
  parentId: null,
  repliedToUserId: null,
  content: 'Test comment content',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockNotification: Notification = {
  id: 'test-notification-id',
  recipientId: 'test-user-id',
  senderId: 'other-user-id',
  type: 'NEW_COMMENT',
  blogId: 'test-blog-id',
  commentId: 'test-comment-id',
  entityType: 'COMMENT',
  content: 'New comment on your blog',
  isRead: false,
  createdAt: new Date(),
};

export const mockEmailVerificationToken = {
  id: 'token-id',
  email: 'test@example.com',
  token: 'verification-token-123',
  expires: new Date(Date.now() + 3600000), // 1 hour from now
};

export const mockResetPasswordToken = {
  id: 'reset-token-id',
  email: 'test@example.com',
  token: 'reset-token-123',
  expires: new Date(Date.now() + 3600000), // 1 hour from now
};
