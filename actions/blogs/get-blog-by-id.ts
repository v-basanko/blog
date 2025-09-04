"use server"

import {db} from "@/lib/db";

export const getBlogById = async ({blogId}: { blogId: string }) => {
    if (!blogId) {
        return {error: "Blog id is required"};
    }

    try {
        const blog = await db.blog.findUnique({
            where: {
                id: blogId,
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

        return {success: blog};
    } catch (ex) {
        return {error: "Error fetching blog!"}
    }
}