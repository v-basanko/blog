import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../mocks/prisma');
  return { db: prismaMock };
});

import { getUserByEmail, getUserById } from '@/lib/user';
import { mockUser } from '../mocks/data';
import { prismaMock } from '../mocks/prisma';

describe('user utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await getUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should return null on database error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('DB error'));

      const result = await getUserByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserById('test-user-id');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
      });
    });

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await getUserById('nonexistent-id');

      expect(result).toBeNull();
    });

    it('should return null on database error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('DB error'));

      const result = await getUserById('test-user-id');

      expect(result).toBeNull();
    });
  });
});
