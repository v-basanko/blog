import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');
vi.mock('@/lib/edgestore-server', () => ({
  backendClient: {
    publicFiles: {
      deleteFile: vi.fn().mockResolvedValue({ success: true }),
    },
  },
}));

import { deleteUser } from '@/actions/users/delete-user';
import { mockBlog, mockUser } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';
import { mockSession } from '../../mocks/session';

describe('deleteUser action', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);
  });

  it('should return error if user not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const result = await deleteUser('non-existent-user');

    expect(result.error).toBe('User not found');
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it('should return error if user is not authorized', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      id: 'different-user-id',
    });

    const result = await deleteUser('different-user-id');

    expect(result.error).toBe('You are not authorized to delete this user');
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it('should successfully delete user without blogs', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.blog.findMany.mockResolvedValue([]);
    prismaMock.user.delete.mockResolvedValue(mockUser);

    const result = await deleteUser(mockUser.id);

    expect(result.success).toBe('User deleted successfully!');
    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
  });

  it('should delete user and their blog cover images', async () => {
    const blogsWithImages = [
      { ...mockBlog, coverImage: 'https://example.com/image1.jpg' },
      { ...mockBlog, id: 'blog-2', coverImage: 'https://example.com/image2.jpg' },
    ];

    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.blog.findMany.mockResolvedValue(blogsWithImages as any);
    prismaMock.user.delete.mockResolvedValue(mockUser);

    const { backendClient } = await import('@/lib/edgestore-server');
    vi.mocked(backendClient.publicFiles.deleteFile).mockResolvedValue({} as any);

    const result = await deleteUser(mockUser.id);

    expect(result.success).toBe('User deleted successfully!');
    expect(backendClient.publicFiles.deleteFile).toHaveBeenCalledTimes(2);
  });
});
