import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.emailVerificationToken.findFirst({
      where: {
        email,
      },
      orderBy: { expires: 'desc' },
    });
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 60);
  const existsToken = await getVerificationTokenByEmail(email);

  if (existsToken) {
    await db.emailVerificationToken.delete({
      where: {
        id: existsToken.id,
      },
    });
  }

  return db.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

export const sendEmailVerificationToken = async (email: string, token: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const emailVerificationLink = `${process.env.BASE_URL}/email-verification?token=${token}`;
  const res = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Email Verification',
    html: `<p>Please click the <a href="${emailVerificationLink}">link</a> below to verify your email</p>`,
  });
  return { error: res.error };
};
