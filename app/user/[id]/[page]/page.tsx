import { auth } from '@/auth';
import Alert from '@/components/common/alert';
import UserProfile from '@/components/user/user-profile';
import { db } from '@/lib/db';
import { ParamId } from '@/shared/types/param-id';
import { ParamPage } from '@/shared/types/param-page';
import { User } from '@prisma/client';

export type UserWithFollows = User & {
  followers: {
    follower: Pick<User, 'id' | 'name' | 'image'> & {
      followers: {
        id: string;
      }[];
    };
  }[];
  followings: {
    following: Pick<User, 'id' | 'name' | 'image'> & {
      followers: {
        id: string;
      }[];
    };
  }[];
  _count: {
    followers: number;
    followings: number;
  };
};

export type ProfilePageProps = {
  params: Promise<ParamId & ParamPage>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id, page } = await params;
  const session = await auth();
  const currentUserId = session?.user?.userId;

  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      followers: {
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
              followers: {
                where: { followerId: currentUserId },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      followings: {
        include: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
              followers: {
                where: { followerId: currentUserId },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          followers: true,
          followings: true,
        },
      },
    },
  });

  if (!user) return <Alert error message="User not found" />;

  const follow = await db.follow.findFirst({
    where: {
      followerId: currentUserId,
      followingId: user.id,
    },
  });

  return <UserProfile user={user} page={page} isFollowing={!!follow} />;
};

export default ProfilePage;
