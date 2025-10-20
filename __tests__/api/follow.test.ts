import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');

import { POST } from '@/app/api/follow/route';
import { prismaMock } from '../mocks/prisma';
import { mockSession } from '../mocks/session';

describe('/api/follow POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/follow', {
      method: 'POST',
      body: JSON.stringify({ followId: 'user-to-follow' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if followId is not provided', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);

    const request = new NextRequest('http://localhost:3000/api/follow', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No user to follow');
  });

  it('should return 400 if user tries to follow themselves', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);

    const request = new NextRequest('http://localhost:3000/api/follow', {
      method: 'POST',
      body: JSON.stringify({ followId: mockSession.user.userId }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('You cannot follow yourself');
  });

  it('should create follow relationship if not exists', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);

    prismaMock.follow.findUnique.mockResolvedValue(null);
    prismaMock.follow.create.mockResolvedValue({
      id: 'follow-id',
      followerId: mockSession.user.userId,
      followingId: 'user-to-follow',
      createdAt: new Date(),
    });

    const request = new NextRequest('http://localhost:3000/api/follow', {
      method: 'POST',
      body: JSON.stringify({ followId: 'user-to-follow' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe('Followed');
    expect(prismaMock.follow.create).toHaveBeenCalled();
  });

  it('should delete follow relationship if already exists', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);

    const existingFollow = {
      id: 'follow-id',
      followerId: mockSession.user.userId,
      followingId: 'user-to-follow',
      createdAt: new Date(),
    };

    prismaMock.follow.findUnique.mockResolvedValue(existingFollow);
    prismaMock.follow.delete.mockResolvedValue(existingFollow);

    const request = new NextRequest('http://localhost:3000/api/follow', {
      method: 'POST',
      body: JSON.stringify({ followId: 'user-to-follow' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe('Unfollowed');
    expect(prismaMock.follow.delete).toHaveBeenCalled();
  });

  it('should return 500 on database error', async () => {
    const { auth } = await import('@/auth');
    vi.mocked(auth).mockResolvedValue(mockSession);

    prismaMock.follow.findUnique.mockRejectedValue(new Error('DB error'));

    const request = new NextRequest('http://localhost:3000/api/follow', {
      method: 'POST',
      body: JSON.stringify({ followId: 'user-to-follow' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
});
