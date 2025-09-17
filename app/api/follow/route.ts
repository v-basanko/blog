import { auth } from '@/auth';
import { db } from '@/lib/db';
import { FollowedStatus } from '@/shared/enum/followed-status.enum';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();
    const userId = session?.user?.userId;
    const followId = body.followId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!followId) {
      return NextResponse.json({ error: 'No user to follow' }, { status: 400 });
    }

    if (userId === followId) {
      return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 });
    }

    const existsFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followId,
        },
      },
    });

    if (existsFollow) {
      await db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: followId,
          },
        },
      });

      return NextResponse.json({ success: FollowedStatus.UNFOLLOWED });
    } else {
      await db.follow.create({
        data: {
          followerId: userId,
          followingId: followId,
        },
      });
      return NextResponse.json({ success: FollowedStatus.FOLLOWED });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
