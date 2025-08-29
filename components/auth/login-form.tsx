'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema, LoginSchemaType} from "@/schemas/login-schema";
import FormField from "@/components/common/form-field";
import Button from "@/components/common/button";
import Heading from "@/components/common/heading";
import SocialAuth from "@/components/auth/social-auth";

const LoginForm = () => {

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginSchemaType>({resolver: zodResolver(LoginSchema)});

    const onSubmit: SubmitHandler<LoginSchemaType> = (data: LoginSchemaType) => {
        console.log(data);
    }

    return (<form className="flex flex-col max-w-[500px] m-auto mt-8 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Heading title="Login to your account" lg center/>
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
            placeholder="Enter your password"
            errors={errors}/>
        <Button type="submit" label='Login'/>
        <div className="flex justify-center my-2">Or</div>
        <SocialAuth/>
    </form>)
}

export default LoginForm;