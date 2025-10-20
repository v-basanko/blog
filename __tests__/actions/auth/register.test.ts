import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/lib/email-verification');
vi.mock('@/lib/user');

// Import after mocks are set up
import { register } from '@/actions/auth/register';
import { mockUser } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';

describe('register action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const registerData = {
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    // Mock getUserByEmail to return null (user doesn't exist)
    const { getUserByEmail } = await import('@/lib/user');
    vi.mocked(getUserByEmail).mockResolvedValue(null);

    // Mock user creation
    vi.mocked(prismaMock.user.create).mockResolvedValue({
      ...mockUser,
      email: registerData.email,
      name: registerData.name,
    });

    // Mock email verification
    const emailVerification = await import('@/lib/email-verification');
    vi.mocked(emailVerification.generateVerificationToken).mockResolvedValue({
      id: 'token-id',
      token: 'verification-token',
      email: registerData.email,
      expires: new Date(),
    });
    vi.mocked(emailVerification.sendEmailVerificationToken).mockResolvedValue({ error: null });

    const result = await register(registerData);

    expect(result.success).toBe('Verification email sent!');
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: registerData.name,
        email: registerData.email,
        password: expect.any(String),
      },
    });
  });

  it('should return error if user already exists', async () => {
    const registerData = {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    // Mock getUserByEmail to return existing user
    const { getUserByEmail } = await import('@/lib/user');
    vi.mocked(getUserByEmail).mockResolvedValue(mockUser);

    const result = await register(registerData);

    expect(result.error).toBe('User already exists!');
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it('should return error with invalid fields', async () => {
    const invalidData = {
      name: 'x',
      email: 'invalid-email',
      password: '123',
      confirmPassword: '123',
    };

    const result = await register(invalidData as any);

    expect(result.error).toBe('Invalid fields!');
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it('should return error if email sending fails', async () => {
    const registerData = {
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const { getUserByEmail } = await import('@/lib/user');
    vi.mocked(getUserByEmail).mockResolvedValue(null);

    vi.mocked(prismaMock.user.create).mockResolvedValue({
      ...mockUser,
      email: registerData.email,
    });

    const emailVerification = await import('@/lib/email-verification');
    vi.mocked(emailVerification.generateVerificationToken).mockResolvedValue({
      id: 'token-id',
      token: 'verification-token',
      email: registerData.email,
      expires: new Date(),
    });
    vi.mocked(emailVerification.sendEmailVerificationToken).mockResolvedValue({
      error: 'Email send failed',
    });

    const result = await register(registerData);

    expect(result.error).toBe('Something went wrong while sending the email verification token!');
  });
});
