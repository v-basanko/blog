import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock db module before any imports
vi.mock('@/lib/db', async () => {
  const { prismaMock } = await import('../../mocks/prisma');
  return { db: prismaMock };
});

vi.mock('@/lib/reset-password-token');

import { resetPassword } from '@/actions/auth/reset-password';
import { mockResetPasswordToken, mockUser } from '../../mocks/data';
import { prismaMock } from '../../mocks/prisma';

describe('resetPassword action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if token is null', async () => {
    const result = await resetPassword({ password: 'newpassword123' }, null);

    expect(result.error).toBe('Invalid token!');
  });

  it('should return error with invalid password', async () => {
    const result = await resetPassword({ password: '123' }, 'valid-token');

    expect(result.error).toBe('Invalid password!');
  });

  it('should return error if token does not exist', async () => {
    const { getResetPasswordTokenByToken } = await import('@/lib/reset-password-token');
    vi.mocked(getResetPasswordTokenByToken).mockResolvedValue(null);

    const result = await resetPassword(
      { password: 'newpassword123', confirmPassword: 'newpassword123' },
      'invalid-token',
    );

    expect(result.error).toBe('Invalid token!');
  });

  it('should return error if token is expired', async () => {
    const expiredToken = {
      ...mockResetPasswordToken,
      expires: new Date(Date.now() - 3600000), // 1 hour ago
    };

    const { getResetPasswordTokenByToken } = await import('@/lib/reset-password-token');
    vi.mocked(getResetPasswordTokenByToken).mockResolvedValue(expiredToken);

    const result = await resetPassword(
      { password: 'newpassword123', confirmPassword: 'newpassword123' },
      'expired-token',
    );

    expect(result.error).toBe('Token expired!');
  });

  it('should return error if user not found', async () => {
    const { getResetPasswordTokenByToken } = await import('@/lib/reset-password-token');
    vi.mocked(getResetPasswordTokenByToken).mockResolvedValue(mockResetPasswordToken);

    prismaMock.user.findUnique.mockResolvedValue(null);

    const result = await resetPassword(
      { password: 'newpassword123', confirmPassword: 'newpassword123' },
      'valid-token',
    );

    expect(result.error).toBe('User not found!');
  });

  it('should successfully reset password', async () => {
    const { getResetPasswordTokenByToken } = await import('@/lib/reset-password-token');
    vi.mocked(getResetPasswordTokenByToken).mockResolvedValue(mockResetPasswordToken);

    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.user.update.mockResolvedValue({
      ...mockUser,
      password: 'new_hashed_password',
    });
    prismaMock.resetPasswordToken.delete.mockResolvedValue(mockResetPasswordToken);

    const result = await resetPassword(
      { password: 'newpassword123', confirmPassword: 'newpassword123' },
      'valid-token',
    );

    expect(result.success).toBe('Password reset successfully!');
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { password: expect.any(String) },
    });
    expect(prismaMock.resetPasswordToken.delete).toHaveBeenCalledWith({
      where: { id: mockResetPasswordToken.id },
    });
  });
});
