'use server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { generateVerificationToken, sendEmailVerificationToken } from '@/lib/email-verification';
import { getUserByEmail, getUserById } from '@/lib/user';
import { EditProfileSchema, EditProfileSchemaType } from '@/schemas/edit-profile-schema';

export const editUser = async (values: EditProfileSchemaType, userId: string) => {
  const vFields = EditProfileSchema.safeParse(values);

  if (!vFields.success) {
    return { error: 'Invalid fields' };
  }

  const session = await auth();

  if (session?.user?.userId !== userId) {
    return { error: 'You are not authorized to edit this user' };
  }

  const user = await getUserById(userId);

  if (!user) {
    return { error: 'User not found' };
  }

  if (user.email !== vFields.data.email) {
    const existsUser = await getUserByEmail(vFields.data.email);
    if (existsUser) {
      return { error: 'User already exists!' };
    }

    await db.user.update({
      where: { id: userId },
      data: {
        ...vFields.data,
        emailVerified: null,
      },
    });

    const emailVerificationToken = await generateVerificationToken(vFields.data.email);

    const result = await sendEmailVerificationToken(
      vFields.data.email,
      emailVerificationToken.token,
    );

    if (result.error) {
      return { error: 'Something went wrong while sending the email verification token!' };
    }

    return { success: 'Verification email sent!' };
  } else {
    await db.user.update({
      where: { id: userId },
      data: {
        ...vFields.data,
      },
    });

    return { success: 'User updated' };
  }
};
