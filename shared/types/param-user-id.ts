import { User } from '@prisma/client';

export type ParamUserId = {
  userId: User['id'];
};
