'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTransition} from "react";
import Button from "@/components/common/button";
import {CommentSchema, CommentSchemaType} from "@/schemas/comment-schema";
import TextAreaField from "@/components/common/text-area";
import {addComment} from "@/actions/comments/add-comment";
import { toast } from 'react-hot-toast'

type AddCommentsFormProps = {
    blogId: string;
    userId: string;
    parentId?: string;
    repliedToId?: string;
    placeholder?: string;
    creatorId?: string;
}

const AddCommentsForm = ({blogId, userId, parentId, repliedToId, placeholder, creatorId}: AddCommentsFormProps) => {

    const [isPending, startTransition] = useTransition();

    const {register, handleSubmit, formState: {errors}, reset} = useForm<CommentSchemaType>({
        resolver: zodResolver(CommentSchema),
    });

    const onSubmit: SubmitHandler<CommentSchemaType> = (data) => {
        startTransition(() => {
            addComment({
                values: data,
                userId,
                blogId,
                parentId,
                repliedToUserId: repliedToId,
            }).then((result) => {
                if (result.error) {
                    return toast.error(result.error);
                }
                if(result.success) {
                    toast.success(result.success);
                    reset();

                }
            })
        })
    }

    return (<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col my-2">
        <TextAreaField
            id="content"
            register={register}
            errors={errors}
            placeholder={placeholder ? placeholder : "Add comment"}
            disabled={isPending}
            inputClassNames=""/>
        <div>
            <Button type="submit" label={isPending ? "Submitting..." : "Submit"}></Button>
        </div>
    </form>)
}

export default AddCommentsForm;