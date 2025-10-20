import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');
vi.mock('next/cache');

import { deleteComment } from '@/actions/comments/delete-comment';
import { mockComment } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';
import { mockSession } from '../../mocks/session';

describe('deleteComment action', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);
  });

  it('should return error if comment not found', async () => {
    prismaMock.comment.findUnique.mockResolvedValue(null);

    const result = await deleteComment('non-existent-comment');

    expect(result.error).toBe('Comment not found');
    expect(prismaMock.comment.delete).not.toHaveBeenCalled();
  });

  it('should return error if user is not the owner', async () => {
    prismaMock.comment.findUnique.mockResolvedValue({
      ...mockComment,
      userId: 'different-user-id',
    });

    const result = await deleteComment(mockComment.id);

    expect(result.error).toBe('You are not authorized to delete this comment');
    expect(prismaMock.comment.delete).not.toHaveBeenCalled();
  });

  it('should successfully delete comment', async () => {
    prismaMock.comment.findUnique.mockResolvedValue(mockComment);
    prismaMock.comment.delete.mockResolvedValue(mockComment);

    const result = await deleteComment(mockComment.id);

    expect(result.success).toBe('Comment deleted');
    expect(prismaMock.comment.delete).toHaveBeenCalledWith({
      where: { id: mockComment.id },
    });
  });
});
