'use server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/lib/user';

export const verifyEmail = async (token: string) => {
  const verificationToken = await db.emailVerificationToken.findUnique({ where: { token } });
  if (!verificationToken) {
    return { error: 'Invalid token!' };
  }

  const isExpired = new Date(verificationToken.expiresAt) < new Date();

  if (isExpired) {
    return { error: 'Token expired!' };
  }

  const existsUser = await getUserByEmail(verificationToken.email);

  if (!existsUser) {
    return { error: 'User not found!' };
  }

  await db.user.update({
    where: {
      id: existsUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: verificationToken.email,
    },
  });

  return { success: 'Email verified!' };
};
