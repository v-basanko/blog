export const publicRoutes = [
  '/',
  '/email-verification',
  '/forgot-password',
  '/reset-password',
  /^\/blog\/feed\/\d+$/,
  /^\/blog\/details\/[\w-]+$/,
];

export const authRoutes = ['/login', '/register'];

export const apiAuthPrefix = '/api/auth';

export const LOGIN_REDIRECT = '/blog/feed/1';
