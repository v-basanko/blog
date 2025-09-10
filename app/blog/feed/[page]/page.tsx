import Container from "@/components/layout/container";
import {getPublishedBlogs} from "@/actions/blogs/get-published-blogs";
import Alert from "@/components/common/alert";
import ListBlogs from "@/components/blog/list-blogs";

interface BlogFeedProps {
    params: Promise<{ page: string }>
    searchParams: Promise<{
        tag: string
        title: string
    }>
}

const BlogFeed = async ({ params, searchParams }: BlogFeedProps) => {

    const { page } = await params;
    const searchObj = await searchParams;

    const currentPage = parseInt(page, 10) || 1;

    const { success, error } = await getPublishedBlogs({ page: currentPage, limit: 5, searchObj });

    if(error) {
        return <Alert error message="Error fetching blogs"/>
    }

    if(!success) {
        return <Alert message="No blogs found"/>
    }

    return (<Container>
        <ListBlogs blogs={success.blogs} currentPage={currentPage} hasMore={success.hasMore}/>
    </Container>)
}

export default BlogFeed;