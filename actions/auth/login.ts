'use server'

import {getUserByEmail} from "@/lib/user";
import {LoginSchema, LoginSchemaType} from "@/schemas/login-schema";
import {signIn} from "@/auth";
import {LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";

export const login = async (data: LoginSchemaType) => {
    const validateFields = LoginSchema.safeParse(data);

    if(!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { password, email } = validateFields.data;

    const user = await getUserByEmail(email);

    if(!user || !email || !password || !user.password) {
        return { error: "Invalid credentials!" }
    }

    //if(!user.emailVerified) {
    //    return { error: "Email not verified!" }
   // }

    try {
        await signIn('credentials', { email, password, redirectTo: LOGIN_REDIRECT})
    } catch (e) {
        if(e instanceof AuthError) {
            switch (e.type) {
                case 'CredentialsSignin':
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
    }


    return { success: "User created successfully!" }
}