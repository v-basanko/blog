'use client'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LogOut, Pencil, Shield, User, UserRound} from "lucide-react";
import {DropdownMenuSeparator} from "@radix-ui/react-dropdown-menu";
import {FaRegBookmark} from "react-icons/fa";
import {signIn, signOut, useSession} from "next-auth/react";

const UserButton = () => {

    const session = useSession();

    const imageUrl = session.data?.user?.image || '';

    return (<DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src={imageUrl}/>
                <AvatarFallback className="border-2 border-slate-500 dark:border-slate-50">
                    <UserRound/>
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
                <button className="flex items-center gap-2" type="button">
                    <User size={18}/> Profile
                </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
                <button className="flex items-center gap-2" type="button">
                    <Pencil size={18}/> Create Post
                </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
                <button className="flex items-center gap-2" type="button">
                    <FaRegBookmark size={16}/> Bookmark
                </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
                <button className="flex items-center gap-2" type="button">
                    <Shield size={18}/> Admin
                </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
                <button onClick={() => signOut()} className="flex items-center gap-2" type="button">
                    <LogOut size={18}/> Sign Out
                </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
        </DropdownMenuContent>
    </DropdownMenu>)
}

export default UserButton;