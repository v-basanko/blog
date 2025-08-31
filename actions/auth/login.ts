'use server'

import {getUserByEmail} from "@/lib/user";
import {LoginSchema, LoginSchemaType} from "@/schemas/login-schema";
import {signIn} from "@/auth";
import {LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import {generateVerificationToken, sendEmailVerificationToken} from "@/lib/email-verification";

export const login = async (data: LoginSchemaType) => {
    const validateFields = LoginSchema.safeParse(data);

    if (!validateFields.success) {
        return {error: "Invalid fields!"}
    }

    const {password, email} = validateFields.data;

    const user = await getUserByEmail(email);

    if (!user || !email || !password || !user.password) {
        return {error: "Invalid credentials!"}
    }

    if (!user.emailVerified) {
        const emailVerificationToken = await generateVerificationToken(email);

        const result = await sendEmailVerificationToken(email, emailVerificationToken.token);

        if (result.error) {
            return {error: "Something went wrong while sending the email verification token!"}
        }


        return {success: "Verification email sent!"}
    }

    try {
        await signIn('credentials', {email, password, redirectTo: LOGIN_REDIRECT})
    } catch (e) {
        if (e instanceof AuthError) {
            switch (e.type) {
                case 'CredentialsSignin':
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "Something went wrong!"}
            }
        }
    }


    return {success: "User created successfully!"}
}