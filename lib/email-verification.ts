import {db} from "./db";
import {v4 as uuidv4} from 'uuid';
import {Resend} from "resend";


export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.emailVerificationToken.findUnique({
            where: {
                email,
            }
        });

        return verificationToken;
    } catch (e) {
        return null;
    }
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60);
    const existsToken = await getVerificationTokenByEmail(email);

    if (existsToken) {
        await db.emailVerificationToken.delete({
            where: {
                id: existsToken.id,
            }
        })
    }

    const verificationToken = await db.emailVerificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return verificationToken;
}

export const sendEmailVerificationToken = async (email: string, token: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const emailVerificationLink = `${process.env.BASE_URL}/email-verification?token=${token}`;
    const res = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Email Verification',
        html: `<p>Please click the <a href="${emailVerificationLink}">link</a> below to verify your email</p>`,
    });
    return {error: res.error}
}