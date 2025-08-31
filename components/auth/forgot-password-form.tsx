'use client'

import {useState, useTransition} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ForgotPasswordSchema, ForgotPasswordSchemaType} from "@/schemas/forgot-password-schema";
import Heading from "@/components/common/heading";
import FormField from "@/components/common/form-field";
import Alert from "@/components/common/alert";
import Button from "@/components/common/button";
import {sendForgotPassword} from "@/actions/auth/send-forgot-password";

const ForgotPasswordForm = () => {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ForgotPasswordSchemaType>({resolver: zodResolver(ForgotPasswordSchema)});

    const onSubmit: SubmitHandler<ForgotPasswordSchemaType> = (data: ForgotPasswordSchemaType) => {
        setError('');
        startTransition(async () => {
            const result = await sendForgotPassword(data);
            if (result?.error) {
                setError(result.error);
            }

            if (result?.success) {
                setSuccess(result?.success)
            }
        })
    }


    return (<form className="flex flex-col max-w-[500px] m-auto mt-8 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Heading title="Forgot your password?" lg center/>
        <FormField
            id='email'
            type="text"
            register={register}
            placeholder="Email"
            errors={errors}
            disabled={isPending}/>
        {error && <Alert message={error} error/>}
        {success && <Alert message={success} success/>}
        <Button type="submit" label={isPending ? 'Submitting' : 'Send reset email'} disabled={isPending}/>
    </form>)
}

export default ForgotPasswordForm;