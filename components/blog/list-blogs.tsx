import {Blog, User} from '@prisma/client';
import BlogCard from "@/components/blog/blog-card";
import Pagination from "./pagination";

export type BlogWithUser = Blog & {
    user: Pick<User, 'id' | 'name' | 'image'>;
};

interface ListBlogsProps {
    blogs: BlogWithUser[];
    hasMore: boolean;
    currentPage: number;
    isUserProfile?: boolean;
}

const ListBlogs = ({blogs, hasMore, currentPage, isUserProfile}: ListBlogsProps) => {
    return (<div className="flex flex-col max-w-[800px] m-auto justify-between min-h-[85vh] px-4 pt-2">
        <section>
            {blogs.map((blog) => {
                return <BlogCard key={blog.id} blog={blog} isUserProfile={isUserProfile || false}/>
            })}
        </section>
        <Pagination hasMore={hasMore} currentPage={currentPage}/>
    </div>)
}

export default ListBlogs