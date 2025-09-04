'use client'

import Image from "next/image";
import UserSummary from "@/components/blog/user-summary";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import Reactions from "@/components/blog/reactions";
import Tag from "@/components/common/tag";
import BlockNoteEditor from "@/components/blog/editor/block-note-editor";
import {BlogWithUser} from "@/components/blog/list-blogs";
import {DynamicBlockNoteEditor} from "@/components/blog/editor/dynamic-block-note-editor";

interface BlogContentProps {
    blog: BlogWithUser;
    createdAt?: Date;
    canEdit: boolean;
}

const BlogContent = ({ blog, canEdit, createdAt }: BlogContentProps) => {
    return (<div className="flex flex-col max-w-[900px] m-auto gap-6">
        {blog.coverImage && (<div className="relative w-full h-[35vh] mt-2">
            <Image src={blog.coverImage} fill alt="Cover Image" className="object-cover rounded"/>
        </div>)}
        <div className="flex justify-between items-center">
            {blog.user && <UserSummary user={blog.user} createdDate={createdAt}/>}
            { canEdit && <Link href={`/blog/edit/${blog.id}`}>Edit</Link>}
        </div>
        <div className="flex flex-col gap-2">
            <Separator/>
            <Reactions/>
            <Separator/>
        </div>
        <h2 className="text-6xl font-bold">{blog.title}</h2>
        {blog.tags.length && (<div className="flex gap-4 items-center flex-wrap">
            {blog.tags.map((tag: string)=>{
                return (<Tag key={blog.id + tag}>{tag}</Tag>)
            })}
        </div>)}
        <div>
            <DynamicBlockNoteEditor editable={false} initialContent={blog.content}/>
        </div>
    </div>)
}

export default BlogContent;