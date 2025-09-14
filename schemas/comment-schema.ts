import {z} from "zod";

export const CommentSchema = z.object({
    content: z
        .string()
        .min(4, { message: "Content must be at least 4 characters"})
        .max(500, { message: "Content must be at most 500 characters" }),
});

export type CommentSchemaType = z.infer<typeof CommentSchema>;