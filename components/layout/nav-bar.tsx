'use client'
import Container from "@/components/layout/container";
import ThemeToggle from "@/components/layout/theme-toggle";
import {MdNoteAlt} from "react-icons/md";
import SearchInput from "@/components/layout/search-input";
import Notifications from "@/components/layout/notifications";
import UserButton from "@/components/layout/user-button";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import Tags from "@/components/layout/tags/tags";

const NavBar = () => {
    const session = useSession();
    const isLoggedIn = session.status === 'authenticated';
    const path = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn && path) {
            const updateSession = async () => {
                await session.update();
            }
            updateSession();
        }
    }, [isLoggedIn, path])

    return (<nav className="sticky top-o border-b z-50 ligth: bg-white dark:bg-slate-950">
        <Container>
            <div className="flex justify-between items-center gap-8">
                <div className="flex gap-1 items-center cursor-pointer" onClick={() => router.push('/blog/feed/1')}>
                    <MdNoteAlt/>
                    <div className="font-bold text-x1">Next Blog</div>
                </div>
                <SearchInput/>
                <div className="flex gap-5 sm:gap-8 items-center">
                    <ThemeToggle/>
                    {isLoggedIn && <Notifications/>}
                    {isLoggedIn && <UserButton/>}
                    {!isLoggedIn && <>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                    </>}
                </div>
            </div>
            <Tags/>
        </Container>
    </nav>)
}

export default NavBar;