'use client'

import {useState, useTransition} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ResetPasswordSchema, ResetPasswordSchemaType} from "@/schemas/reset-password-schema";
import Heading from "@/components/common/heading";
import FormField from "@/components/common/form-field";
import Alert from "@/components/common/alert";
import Button from "@/components/common/button";
import {useSearchParams} from "next/navigation";
import {resetPassword} from "@/actions/auth/reset-password";

const ResetPasswordForm = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ResetPasswordSchemaType>({resolver: zodResolver(ResetPasswordSchema)});

    const onSubmit: SubmitHandler<ResetPasswordSchemaType> = (data: ResetPasswordSchemaType) => {
        setError('');
        startTransition(async () => {
            const result = await resetPassword(data, token);
            if (result?.error) {
                setError(result.error);
            }

            if (result?.success) {
                setSuccess(result?.success)
            }
        })
    }


    return (<form className="flex flex-col max-w-[500px] m-auto mt-8 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Heading title="Enter your new password" lg center/>
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
        {error && <Alert message={error} error/>}
        {success && <Alert message={success} success/>}
        <Button type="submit" label={isPending ? 'Submitting' : 'Save new password'} disabled={isPending}/>
    </form>)
}

export default ResetPasswordForm;