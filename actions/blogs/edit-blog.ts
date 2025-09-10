'use server'

import { BlogSchema, BlogSchemaType } from "@/schemas/blog-schema";
import {getUserById} from "@/lib/user";
import {db} from "@/lib/db";


export const editBlog = async (data: BlogSchemaType, id: string) => {
    const validateFields = BlogSchema.safeParse(data);

    if (!validateFields.success) {
        return {error: "Invalid blog data!"}
    }

    const {userId, isPublished} = validateFields.data;

    const user = await getUserById(userId);

    if (!user) {
        return {error: "User not found!"}
    }

    if (isPublished && !user.emailVerified) {
        return {error: "User email is not verified!"}
    }

    const blog = await db.blog.findUnique({ where: { id } });

    if (!blog) {
        return {error: "Blog not found!"}
    }

    await db.blog.update({
        where: { id },
        data: {
            ...validateFields.data,
        }
    });

    return {success: "Blog updated!"}
}