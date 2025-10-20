import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');

import { createBlog } from '@/actions/blogs/create-blog';
import { mockBlog, mockUser } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';
import { mockSession } from '../../mocks/session';

describe('createBlog action', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);
  });

  it('should return error if user is not authenticated', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(null);

    const blogData = {
      title: 'Test Blog',
      content: 'Test content',
      tags: ['test'],
      isPublished: true,
      coverImage: null,
    };

    const result = await createBlog(blogData);

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

    const result = await createBlog(invalidData as any);

    expect(result.error).toBe('Invalid blog data!');
  });

  it('should return error if user not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const blogData = {
      title: 'Test Blog Title With Enough Characters',
      content: 'Test content with enough characters to pass validation',
      tags: ['test'],
      isPublished: true,
      coverImage: undefined,
    };

    const result = await createBlog(blogData);

    expect(result.error).toBe('User not found!');
  });

  it('should return error if publishing without verified email', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      emailVerified: null,
    });

    const blogData = {
      title: 'Test Blog Title With Enough Characters',
      content: 'Test content with enough characters to pass validation',
      tags: ['test'],
      isPublished: true,
      coverImage: undefined,
    };

    const result = await createBlog(blogData);

    expect(result.error).toBe('User email is not verified!');
  });

  it('should successfully create a published blog with verified email', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.blog.create.mockResolvedValue(mockBlog);

    const blogData = {
      title: 'Test Blog Title With Enough Characters',
      content: 'Test content with enough characters to pass validation',
      tags: ['test'],
      isPublished: true,
      coverImage: undefined,
    };

    const result = await createBlog(blogData);

    expect(result.success).toBe('Blog created!');
    expect(prismaMock.blog.create).toHaveBeenCalled();
  });

  it('should successfully create a draft blog without verified email', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      emailVerified: null,
    });
    prismaMock.blog.create.mockResolvedValue({
      ...mockBlog,
      isPublished: false,
    });

    const blogData = {
      title: 'Draft Blog Title With Enough Characters',
      content: 'Draft content with enough characters to pass validation',
      tags: ['draft'],
      isPublished: false,
      coverImage: undefined,
    };

    const result = await createBlog(blogData);

    expect(result.success).toBe('Blog created!');
  });
});
