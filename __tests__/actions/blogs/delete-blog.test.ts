import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');

import { deleteBlog } from '@/actions/blogs/delete-blog';
import { mockBlog } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';
import { mockSession } from '../../mocks/session';

describe('deleteBlog action', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);
  });

  it('should return error if blog not found', async () => {
    prismaMock.blog.findUnique.mockResolvedValue(null);

    const result = await deleteBlog('non-existent-blog');

    expect(result.error).toBe('Blog not found');
    expect(prismaMock.blog.delete).not.toHaveBeenCalled();
  });

  it('should return error if user is not the owner', async () => {
    prismaMock.blog.findUnique.mockResolvedValue({
      ...mockBlog,
      userId: 'different-user-id',
    });

    const result = await deleteBlog(mockBlog.id);

    expect(result.error).toBe('You are not authorized to delete this blog');
    expect(prismaMock.blog.delete).not.toHaveBeenCalled();
  });

  it('should successfully delete blog', async () => {
    prismaMock.blog.findUnique.mockResolvedValue(mockBlog);
    prismaMock.blog.delete.mockResolvedValue(mockBlog);

    const result = await deleteBlog(mockBlog.id);

    expect(result.success).toBe('Blog deleted');
    expect(prismaMock.blog.delete).toHaveBeenCalledWith({
      where: { id: mockBlog.id },
    });
  });
});
