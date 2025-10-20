import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');

import { editBlog } from '@/actions/blogs/edit-blog';
import { mockBlog, mockUser } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';
import { mockSession } from '../../mocks/session';

describe('editBlog action', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);
  });

  it('should return error if user is not authenticated', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(null);

    const blogData = {
      title: 'Updated Blog',
      content: 'Updated content',
      tags: ['updated'],
      isPublished: true,
      coverImage: null,
    };

    const result = await editBlog(blogData, 'blog-id');

    expect(result.error).toBe('Unauthorized');
  });

  it('should return error with invalid blog data', async () => {
    const invalidData = {
      title: '',
      content: '',
      tags: [],
      isPublished: true,
      coverImage: null,
    };

    const result = await editBlog(invalidData as any, 'blog-id');

    expect(result.error).toBe('Invalid blog data!');
  });

  it('should return error if blog not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.blog.findUnique.mockResolvedValue(null);

    const blogData = {
      title: 'Updated Blog Title With Enough Characters',
      content: 'Updated content with enough characters to pass validation',
      tags: ['updated'],
      isPublished: true,
      coverImage: undefined,
    };

    const result = await editBlog(blogData, 'non-existent-blog');

    expect(result.error).toBe('Blog not found!');
  });

  it('should return error if user is not the owner', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.blog.findUnique.mockResolvedValue({
      ...mockBlog,
      userId: 'different-user-id',
    });

    const blogData = {
      title: 'Updated Blog Title With Enough Characters',
      content: 'Updated content with enough characters to pass validation',
      tags: ['updated'],
      isPublished: true,
      coverImage: undefined,
    };

    const result = await editBlog(blogData, mockBlog.id);

    expect(result.error).toBe('You are not authorized to edit this blog!');
    expect(prismaMock.blog.update).not.toHaveBeenCalled();
  });

  it('should return error if publishing without verified email', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      emailVerified: null,
    });
    prismaMock.blog.findUnique.mockResolvedValue(mockBlog);

    const blogData = {
      title: 'Updated Blog Title With Enough Characters',
      content: 'Updated content with enough characters to pass validation',
      tags: ['updated'],
      isPublished: true,
      coverImage: undefined,
    };

    const result = await editBlog(blogData, mockBlog.id);

    expect(result.error).toBe('User email is not verified!');
  });

  it('should successfully update blog', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.blog.findUnique.mockResolvedValue(mockBlog);
    prismaMock.blog.update.mockResolvedValue({
      ...mockBlog,
      title: 'Updated Blog Title With Enough Characters',
    });

    const blogData = {
      title: 'Updated Blog Title With Enough Characters',
      content: 'Updated content with enough characters to pass validation',
      tags: ['updated'],
      isPublished: true,
      coverImage: undefined,
    };

    const result = await editBlog(blogData, mockBlog.id);

    expect(result.success).toBe('Blog updated!');
    expect(prismaMock.blog.update).toHaveBeenCalled();
  });
});
