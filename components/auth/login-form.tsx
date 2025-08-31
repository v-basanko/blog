'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema, LoginSchemaType} from "@/schemas/login-schema";
import FormField from "@/components/common/form-field";
import Button from "@/components/common/button";
import Heading from "@/components/common/heading";
import SocialAuth from "@/components/auth/social-auth";
import {useState, useTransition} from "react";
import {login} from "@/actions/auth/login";
import Alert from "@/components/common/alert";
import {useRouter, useSearchParams} from "next/navigation";
import {LOGIN_REDIRECT} from "@/routes";
import Link from "next/link";

const LoginForm = () => {

    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginSchemaType>({resolver: zodResolver(LoginSchema)});

    const router = useRouter();
    const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email in use with a different provider!' : '';

    const onSubmit: SubmitHandler<LoginSchemaType> = (data: LoginSchemaType) => {
        setError('');
        router.replace('/login');
        startTransition(async () => {
            const result = await login(data);
            if (result?.error) {
                setError(result.error);
            } else {
                router.push(LOGIN_REDIRECT)
            }

            if (result?.success) {
                setSuccess(result?.success)
            }
        })
    }

    return (<form className="flex flex-col max-w-[500px] m-auto mt-8 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Heading title="Login to your account" lg center/>
        <FormField
            id='email'
            type="text"
            register={register}
            placeholder="Enter your email"
            errors={errors}
            disabled={isPending}/>
        <FormField
            id='password'
            type="password"
            register={register}
            placeholder="Enter your password"
            errors={errors}
            disabled={isPending}/>
        {error && <Alert message={error} error/>}
        {success && <Alert message={success} success/>}
        <Button type="submit" label={isPending ? 'Submitting' : 'Login'} disabled={isPending}/>
        <div className="flex justify-center my-2">Or</div>
        {urlError && <Alert message={urlError} error/>}
        <SocialAuth/>
        <div className="flex items-end justify-end">
            <Link className="mt-2 text-sm underline text-slat-700 dark:text-slate-300" href="/forgot-password">Forgot
                password?</Link>
        </div>
    </form>)
}

export default LoginForm;