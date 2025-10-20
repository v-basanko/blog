import '@testing-library/jest-dom/vitest';
import { afterAll, beforeEach, vi } from 'vitest';

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.BASE_URL = 'http://localhost:3000';
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.GITHUB_CLIENT_ID = 'test-github-client-id';
process.env.GITHUB_CLIENT_SECRET = 'test-github-client-secret';
process.env.EDGE_STORE_ACCESS_KEY = 'test-edge-store-access-key';
process.env.EDGE_STORE_SECRET_KEY = 'test-edge-store-secret-key';

// Global test setup
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock next-auth
vi.mock('next-auth', () => {
  return {
    default: vi.fn(() => ({
      handlers: {},
      signIn: vi.fn(),
      signOut: vi.fn(),
      auth: vi.fn(),
    })),
  };
});

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn().mockResolvedValue(true),
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Cleanup after all tests
afterAll(() => {
  // Clear all timers
  vi.clearAllTimers();
  // Restore all mocks
  vi.restoreAllMocks();
});
