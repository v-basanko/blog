'use server';

import { generateResetPasswordToken, sendResetPasswordToken } from '@/lib/reset-password-token';
import { getUserByEmail } from '@/lib/user';
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from '@/schemas/forgot-password-schema';

export const sendForgotPassword = async (data: ForgotPasswordSchemaType) => {
  const validateFields = ForgotPasswordSchema.safeParse(data);

  if (!validateFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validateFields.data;

  const user = await getUserByEmail(email);

  if (!user || user.email !== email) {
    return { error: 'Invalid email!' };
  }

  const passwordResetToken = await generateResetPasswordToken(email);

  const { error } = await sendResetPasswordToken(
    passwordResetToken.email,
    passwordResetToken.token,
  );
  if (error) {
    return { error: 'Something went wrong while sending the password reset token!' };
  }

  return { success: 'Password reset link was sent to your email!' };
};
