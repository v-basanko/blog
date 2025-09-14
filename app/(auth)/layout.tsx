import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Authentication',
};

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div>{children}</div>;
};

export default AuthLayout;
