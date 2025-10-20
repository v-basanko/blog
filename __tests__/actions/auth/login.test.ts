import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/auth');
vi.mock('@/lib/email-verification');

import { login } from '@/actions/auth/login';
import { mockUser } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';

describe('login action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error with invalid fields', async () => {
    const invalidData = {
      email: 'invalid-email',
      password: '',
    };

    const result = await login(invalidData as any);

    expect(result.error).toBe('Invalid fields!');
  });

  it('should return error with invalid credentials', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    prismaMock.user.findUnique.mockResolvedValue(null);

    const result = await login(loginData);

    expect(result.error).toBe('Invalid credentials!');
  });

  it('should return error if user has no password (OAuth user)', async () => {
    const loginData = {
      email: 'oauth@example.com',
      password: 'password123',
    };

    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      password: null,
    });

    const result = await login(loginData);

    expect(result.error).toBe('Invalid credentials!');
  });

  it('should send verification email if user email not verified', async () => {
    const loginData = {
      email: 'unverified@example.com',
      password: 'password123',
    };

    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      emailVerified: null,
    });

    const { generateVerificationToken, sendEmailVerificationToken } = await import(
      '@/lib/email-verification'
    );
    vi.mocked(generateVerificationToken).mockResolvedValue({
      token: 'verification-token',
      email: loginData.email,
      id: 'token-id',
      expires: new Date(),
    });
    vi.mocked(sendEmailVerificationToken).mockResolvedValue({ error: null });

    const result = await login(loginData);

    expect(result.success).toBe('Verification email sent!');
    expect(generateVerificationToken).toHaveBeenCalledWith(loginData.email);
  });

  it('should successfully login verified user', async () => {
    const loginData = {
      email: 'verified@example.com',
      password: 'password123',
    };

    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      emailVerified: new Date(),
    });

    const { signIn } = await import('@/auth');
    vi.mocked(signIn).mockResolvedValue(undefined);

    const result = await login(loginData);

    // The function doesn't return anything on success because signIn redirects
    // So we just check that signIn was called
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: loginData.email,
      password: loginData.password,
      redirectTo: expect.any(String),
    });
  });
});
