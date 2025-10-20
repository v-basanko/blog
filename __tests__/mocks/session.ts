import { Session } from 'next-auth';
import { vi } from 'vitest';

export const mockSession: Session = {
  user: {
    userId: 'test-user-id',
    role: 'USER',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockAdminSession: Session = {
  user: {
    userId: 'admin-user-id',
    role: 'ADMIN',
    name: 'Admin User',
    email: 'admin@example.com',
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockAuthModule = {
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
};
