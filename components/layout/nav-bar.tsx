import Container from "@/components/layout/container";
import ThemeToggle from "@/components/layout/theme-toggle";
import {MdNoteAlt} from "react-icons/md";
import SearchInput from "@/components/layout/search-input";
import Notifications from "@/components/layout/notifications";
import UserButton from "@/components/layout/user-button";
import Link from "next/link";

const NavBar = () => {
    return (<nav className="sticky top-o border-b z-50 ligth: bg-white dark:bg-slate-950">
        <Container>
            <div className="flex justify-between items-center gap-8">
                <div className="flex gap-1 items-center cursor-pointer">
                    <MdNoteAlt/>
                    <div className="font-bold text-x1">Multi User Blog</div>
                </div>
                <SearchInput/>
                <div className="flex gap-5 sm:gap-8 items-center">
                    <ThemeToggle/>
                    <Notifications/>
                    <UserButton />
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                    </>
                </div>
            </div>
        </Container>
    </nav>)
}

export default NavBar;