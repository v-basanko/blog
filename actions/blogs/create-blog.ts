'use server'

import {BlogSchema, BlogSchemaType} from "@/schemas/blog-schema";
import {getUserById} from "@/lib/user";
import {db} from "@/lib/db";

export const createBlog = async (data: BlogSchemaType) => {
    const validateFields = BlogSchema.safeParse(data);

    if (!validateFields.success) {
        return {error: "Invalid blog data!"}
    }

    const {userId, isPublished} = validateFields.data;

    const user = await getUserById(userId);
console.log(user)
    if (!user) {
        return {error: "User not found!"}
    }

    if (isPublished && !user.emailVerified) {
        return {error: "User email is not verified!"}
    }

    await db.blog.create({
        data: {
            ...validateFields.data,
            userId,
        }
    });

    return {success: "Blog created!"}
}