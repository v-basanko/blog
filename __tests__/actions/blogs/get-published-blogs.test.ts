import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');

import { getPublishedBlogs } from '@/actions/blogs/get-published-blogs';
import { mockBlog } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';
import { mockSession } from '../../mocks/session';

describe('getPublishedBlogs action', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);
  });

  it('should successfully fetch published blogs', async () => {
    const mockBlogs = [mockBlog, { ...mockBlog, id: 'blog-2' }];

    prismaMock.blog.findMany.mockResolvedValue(mockBlogs as any);
    prismaMock.blog.count.mockResolvedValue(10);

    const result = await getPublishedBlogs({
      page: 1,
      limit: 5,
      searchObj: { tag: '', title: '' },
    });

    expect(result.success).toBeDefined();
    expect(result.success?.blogs).toEqual(mockBlogs);
    expect(result.success?.hasMore).toBe(true);
  });

  it('should filter blogs by tag', async () => {
    prismaMock.blog.findMany.mockResolvedValue([mockBlog] as any);
    prismaMock.blog.count.mockResolvedValue(1);

    const result = await getPublishedBlogs({
      page: 1,
      limit: 5,
      searchObj: { tag: 'test', title: '' },
    });

    expect(prismaMock.blog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tags: { has: 'test' },
        }),
      }),
    );
  });

  it('should filter blogs by title', async () => {
    prismaMock.blog.findMany.mockResolvedValue([mockBlog] as any);
    prismaMock.blog.count.mockResolvedValue(1);

    const result = await getPublishedBlogs({
      page: 1,
      limit: 5,
      searchObj: { tag: '', title: 'Test' },
    });

    expect(prismaMock.blog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: {
            contains: 'Test',
            mode: 'insensitive',
          },
        }),
      }),
    );
  });

  it('should indicate no more results when on last page', async () => {
    prismaMock.blog.findMany.mockResolvedValue([mockBlog] as any);
    prismaMock.blog.count.mockResolvedValue(5);

    const result = await getPublishedBlogs({
      page: 1,
      limit: 5,
      searchObj: { tag: '', title: '' },
    });

    expect(result.success?.hasMore).toBe(false);
  });

  it('should return error on database failure', async () => {
    prismaMock.blog.findMany.mockRejectedValue(new Error('Database error'));

    const result = await getPublishedBlogs({
      page: 1,
      limit: 5,
      searchObj: { tag: '', title: '' },
    });

    expect(result.error).toBe('Error fetching blogs!');
  });
});
