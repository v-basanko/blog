import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findUnique({
      where: {
        email,
      },
    });

    return resetPasswordToken;
  } catch (e) {
    return null;
  }
};

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });

    return resetPasswordToken;
  } catch (e) {
    return null;
  }
};

export const generateResetPasswordToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 60);
  const existsToken = await getResetPasswordTokenByEmail(email);

  if (existsToken) {
    await db.resetPasswordToken.delete({
      where: {
        id: existsToken.id,
      },
    });
  }

  const resetPasswordToken = await db.resetPasswordToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetPasswordToken;
};

export const sendResetPasswordToken = async (email: string, token: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const resetPasswordLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
  const res = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Password Reset',
    html: `<p>Please click the <a href="${resetPasswordLink}">link</a> below to reset your password</p>`,
  });
  return { error: res.error };
};
