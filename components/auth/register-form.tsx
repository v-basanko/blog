'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterSchema, RegisterSchemaType} from "@/schemas/register-schema";
import FormField from "@/components/common/form-field";
import Button from "@/components/common/button";
import Heading from "@/components/common/heading";
import SocialAuth from "@/components/auth/social-auth";
import {register as registerUser} from "@/actions/auth/register";
import {useState, useTransition} from "react";
import Alert from "@/components/common/alert";

const RegisterForm = () => {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterSchemaType>({resolver: zodResolver(RegisterSchema)});

    const onSubmit: SubmitHandler<RegisterSchemaType> = (data: RegisterSchemaType) => {
        setError('');
        setSuccess('');
        startTransition(async () => {
            const result = await registerUser(data);
            setError(result.error);
            setSuccess(result.success);
        })
    }

    return (<form className="flex flex-col max-w-[500px] m-auto mt-8 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Heading title="Create account" lg center/>
        <FormField
            id='name'
            type="text"
            register={register}
            placeholder="Enter your name"
            errors={errors}/>
        <FormField
            id='email'
            type="text"
            register={register}
            placeholder="Enter your email"
            errors={errors}/>
        <FormField
            id='password'
            type="password"
            register={register}
            placeholder="New password"
            errors={errors}/>
        <FormField
            id='confirmPassword'
            type="password"
            register={register}
            placeholder="Confirm password"
            errors={errors}/>
        <div>
            {error && <Alert message={error} error/>}
            {success && <Alert message={success} success/>}
        </div>
        <Button type="submit" label={isPending ? 'Submitting' : 'Register'} disabled={isPending}/>
        <div className="flex justify-center my-2">Or</div>
        <SocialAuth/>
    </form>)
}

export default RegisterForm;