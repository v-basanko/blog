'use server'

import {db} from "@/lib/db";

export const getPublishedBlogs = async ({page = 1, limit = 5, searchObj}: {
    page: number,
    limit: number,
    searchObj: { tag: string, title: string }
}) => {
    const skip = (page - 1) * limit;
    const {tag, title} = searchObj;

    try {
        const blogs = await db.blog.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
                isPublished: true,
                ...(tag ? {tags: {has: tag}} : {}),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
            }
        });

        const totalBlogsCount = await db.blog.count({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
                isPublished: true,
                ...(tag ? {tags: {has: tag}} : {}),
            }
        });

        const hasMore = page * limit < totalBlogsCount;

        return {success: {blogs, hasMore}};
    } catch (e) {
        console.log(e);
        return {error: "Error fetching blogs!"}
    }
}