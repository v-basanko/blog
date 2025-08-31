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
import {useRouter} from "next/navigation";
import {LOGIN_REDIRECT} from "@/routes";

const LoginForm = () => {

    const [ isPending, startTransition ] = useTransition();
    const [ error, setError ] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginSchemaType>({resolver: zodResolver(LoginSchema)});

    const router = useRouter();

    const onSubmit: SubmitHandler<LoginSchemaType> = (data: LoginSchemaType) => {
        setError('');
        startTransition(async ()=>{
            const result = await login(data);
            if(result?.error) {
                setError(result.error);
            } else {
                router.push(LOGIN_REDIRECT)
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
        <div>
            {error && <Alert message={error} error/>}
        </div>
        <Button type="submit" label={ isPending ? 'Submitting' : 'Login' } disabled={isPending}/>
        <div className="flex justify-center my-2">Or</div>
        <SocialAuth/>
    </form>)
}

export default LoginForm;