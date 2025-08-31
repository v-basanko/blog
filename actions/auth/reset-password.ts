'use server'

import {getUserByEmail} from "@/lib/user";
import {ResetPasswordSchema, ResetPasswordSchemaType} from "@/schemas/reset-password-schema";
import {
    getResetPasswordTokenByToken
} from "@/lib/reset-password-token";
import bcrypt from "bcryptjs";
import {db} from "@/lib/db";

export const resetPassword = async (data: ResetPasswordSchemaType, token: string | null) => {

    if (!token) {
        return {error: "Invalid token!"}
    }

    const validateFields = ResetPasswordSchema.safeParse(data);

    if (!validateFields.success) {
        return {error: "Invalid password!"}
    }

    const existsToken = await getResetPasswordTokenByToken(token);

    if (!existsToken) {
        return {error: "Invalid token!"}
    }

    const isExpired = new Date(existsToken.expires) < new Date();

    if (isExpired) {
        return {error: "Token expired!"}
    }

    const user = await getUserByEmail(existsToken.email);

    if (!user) {
        return {error: "User not found!"}
    }

    const {password} = validateFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: hashedPassword,
        }
    })

    await db.resetPasswordToken.delete({where: {id: existsToken.id}})

    return {success: "Password reset successfully!"}
}