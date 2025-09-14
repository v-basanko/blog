'use client'

import {CommentWithUser} from "@/components/comments/list-comments";
import {cn} from "@/lib/utils";
import {Dispatch, SetStateAction, useState} from "react";
import {FaHandsClapping} from "react-icons/fa6";
import {FaRegComment} from "react-icons/fa";
import {BsReply} from "react-icons/bs";
import {useSession} from "next-auth/react";
import {MdDeleteOutline} from "react-icons/md";
import {deleteComment} from "@/actions/comments/delete-comment";
import {toast} from "react-hot-toast";
import {PiHandsClapping} from "react-icons/pi";
import {useRouter} from "next/navigation";
import {clapComment} from "@/actions/comments/clap-comment";

type CommentReactionsProps = {
    comment: CommentWithUser;
    setShowForm: Dispatch<SetStateAction<boolean>>;
    setShowReplies?: Dispatch<SetStateAction<boolean>>;
    isReply?: boolean;
}

const CommentReactions = ({comment, setShowReplies, setShowForm, isReply}: CommentReactionsProps) => {

    const router = useRouter();
    const session = useSession();
    const userId = session.data?.user.userId;
    const [clapCount, setClapCount] = useState(comment._count.claps);
    const [userHasClapped, setUserHasClapped] = useState(!!comment.claps.length);

    const handleClap = async () => {
        if (!userId) {
            return;
        }

        setClapCount(prevCount => userHasClapped ? prevCount - 1 : prevCount + 1);
        setUserHasClapped(prevState => !prevState);
        await clapComment(comment.id, userId);
        router.refresh();
    }

    const handleReply = () => {
        setShowForm(prevState => !prevState);
    }

    const handleShowReplies = () => {
        if (setShowReplies) {
            setShowReplies(prevState => !prevState);
        }
    }

    const handleDelete = async () => {
        if (userId) {
            const res = await deleteComment(comment.id, userId)

            if (res.success) {
                toast.success(res.success);
            }
        }
    }

    return (
        <div className={cn('flex justify-between items-center w-full text-sm mt-2 gap-4', isReply && 'justify-start')}>
            <div className="flex items-center gap-4">
                <span onClick={handleClap} className="flex items-center gap-1 cursor-pointer">
                    {userHasClapped ? <FaHandsClapping size={20}/> : <PiHandsClapping size={20}/>} {clapCount}
                </span>
                {!isReply &&
                    <span onClick={handleShowReplies} className="flex items-center gap-1 cursor-pointer"><FaRegComment
                        size={20}/> Replies {comment._count.replies} </span>}
            </div>
            <div className="flex items-center">
                <span className="flex items-center gap-1 cursor-pointer mr-4" onClick={handleReply}>
                    <BsReply string={20}/> Reply
                </span>
                {userId === comment.userId &&
                    <span onClick={handleDelete} className="cursor-pointer"><MdDeleteOutline size={20}/></span>}
            </div>
        </div>)
}

export default CommentReactions;