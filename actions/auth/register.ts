'use server'

import {RegisterSchema, RegisterSchemaType} from "@/schemas/register-schema";
import bcrypt from "bcryptjs";
import {db} from "@/lib/db";
import {getUserByEmail} from "@/lib/user";

export const signUp = async (data: RegisterSchemaType) => {
    const validateFields = RegisterSchema.safeParse(data);

    if(!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { name, password, email } = validateFields.data;

    const existsUser = await getUserByEmail(email);

    if(existsUser) {
        return { error: "User already exists!" }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    return { success: "User created successfully!" }
}