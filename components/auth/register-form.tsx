'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterSchema, RegisterSchemaType} from "@/schemas/register-schema";
import FormField from "@/components/common/form-field";
import Button from "@/components/common/button";
import Heading from "@/components/common/heading";
import SocialAuth from "@/components/auth/social-auth";

const RegisterForm = () => {

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterSchemaType>({resolver: zodResolver(RegisterSchema)});

    const onSubmit: SubmitHandler<RegisterSchemaType> = (data: RegisterSchemaType) => {
        console.log(data);
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
        <Button type="submit" label='Register'/>
        <div className="flex justify-center my-2">Or</div>
        <SocialAuth/>
    </form>)
}

export default RegisterForm;