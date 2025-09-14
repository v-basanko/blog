'use server';

import { db } from '@/lib/db';
import { generateVerificationToken, sendEmailVerificationToken } from '@/lib/email-verification';
import { getUserByEmail } from '@/lib/user';
import { RegisterSchema, RegisterSchemaType } from '@/schemas/register-schema';
import bcrypt from 'bcryptjs';

export const register = async (data: RegisterSchemaType) => {
  const validateFields = RegisterSchema.safeParse(data);

  if (!validateFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name, password, email } = validateFields.data;

  const existsUser = await getUserByEmail(email);

  if (existsUser) {
    return { error: 'User already exists!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const emailVerificationToken = await generateVerificationToken(email);

  const result = await sendEmailVerificationToken(email, emailVerificationToken.token);

  if (result.error) {
    return { error: 'Something went wrong while sending the email verification token!' };
  }

  return { success: 'Verification email sent!' };
};
