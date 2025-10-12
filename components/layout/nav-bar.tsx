'use client';
import Container from '@/components/layout/container';
import Notifications from '@/components/layout/notifications';
import SearchInput from '@/components/layout/search-input';
import Tags from '@/components/layout/tags/tags';
import ThemeToggle from '@/components/layout/theme-toggle';
import UserButton from '@/components/layout/user-button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MdNoteAlt } from 'react-icons/md';

const NavBar = () => {
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';
  const path = usePathname();
  const router = useRouter();

  const isFeedsPage = path.includes('/blog/feed');

  useEffect(() => {
    if (!isLoggedIn && path) {
      const updateSession = async () => {
        await session.update();
      };
      updateSession();
    }
  }, [isLoggedIn, path, session]);

  return (
    <nav className="sticky top-o border-b z-50 ligth: bg-white dark:bg-slate-950">
      <Container>
        <div className="flex justify-between items-center gap-8">
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => router.push('/blog/feed/1')}
          >
            <MdNoteAlt />
            <div className="font-bold text-x1">Next Blog</div>
          </div>
          {isFeedsPage && <SearchInput />}
          <div className="flex gap-5 sm:gap-8 items-center">
            <ThemeToggle />
            {isLoggedIn && <Notifications />}
            {isLoggedIn && <UserButton />}
            {!isLoggedIn && (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
        <Tags />
      </Container>
    </nav>
  );
};

export default NavBar;
