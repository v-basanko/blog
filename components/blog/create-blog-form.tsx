'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {BlogSchema, BlogSchemaType} from "@/schemas/blog-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import FormField from "@/components/common/form-field";
import AddCover from "@/components/blog/add-cover";
import {useEffect, useState, useTransition} from "react";
import CoverImage from "@/components/blog/cover-image";
import {tags} from "@/lib/tags";
import {DynamicBlockNoteEditor} from "@/components/blog/editor/dynamic-block-note-editor";
import Button from "@/components/common/button";
import Alert from "@/components/common/alert";
import {createBlog} from "@/actions/blogs/create-blog";
import {Blog} from "@prisma/client";
import {editBlog} from "@/actions/blogs/edit-blog";

const CreateBlogForm = ({ blog }: { blog?: Blog }) => {

    const session = useSession();
    const userId = session.data?.user.userId;
    const [uploadedCover, setUploadedCover] = useState<string>();
    const [content, setContent] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [isPublishing, startPublishTransition] = useTransition();
    const [isSaving, startSaveDraftTransition] = useTransition();

    const {register, handleSubmit, formState: {errors}, setValue} = useForm<BlogSchemaType>({
        resolver: zodResolver(BlogSchema),
        defaultValues:blog ? {
            userId: blog.userId,
            isPublished: blog.isPublished,
            title: blog.title,
            content: blog.content,
            coverImage: blog.coverImage || undefined,
            tags: blog.tags
        } : {
            userId,
            isPublished: false
        }
    });

    useEffect(() => {
        if (uploadedCover) {
            setValue('coverImage', uploadedCover, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        }
    }, [uploadedCover]);

    useEffect(() => {
        if (typeof content === 'string') {
            setValue('content', content, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        }
    }, [content]);

    useEffect(()=>{
        if(blog?.coverImage) {
            setUploadedCover(blog.coverImage)
        }
    }, [ blog?.coverImage ])

    const onChange = (data: string) => {
        setContent(data);
    }

    const save = (data: BlogSchemaType, isPublished: boolean) => {
        setSuccess('');
        setError('');

        if (data.tags.length < 1 || data.tags.length > 4) {
            return setError('Select at least one tag, max of 4');
        }

        const startTransition = isPublished ? startPublishTransition : startSaveDraftTransition;

        startTransition(() => {
            if(blog) {
                editBlog({...data, isPublished}, blog.id).then((result) => {
                    if (result.error) {
                        setError(result.error);
                    }

                    if (result.success) {
                        setSuccess(result.success);
                    }
                })
            } else {
                createBlog({...data, isPublished}).then((result) => {
                    if (result.error) {
                        setError(result.error);
                    }

                    if (result.success) {
                        setSuccess(result.success);
                    }
                })
            }

        })
    }

    const onPublish: SubmitHandler<BlogSchemaType> = (data) => {
        return save(data, true);
    }

    const onSaveDraft: SubmitHandler<BlogSchemaType> = (data) => {
        return save(data, false);
    }

    return (<form onSubmit={handleSubmit(onPublish)}
                  className="flex flex-col justify-between max-w-[1200px] m-auto min-h-[85vh]">
        <div>
            {!!uploadedCover && <CoverImage url={uploadedCover} isEditor={true} setUploadedCover={setUploadedCover}/>}
            {!uploadedCover && <AddCover setUploadedCover={setUploadedCover}/>}

            <FormField
                id="title"
                register={register}
                errors={errors}
                placeholder="Blog Title"
                disabled={false}
                inputClassNames="border-none text-5x1 font-bold bg-transparent px-o"
            />
            <fieldset className="flex flex-col border-y mb-4 py-2">
                <legend className="mb-2 pr-2">Select 4 Tags</legend>
                <div className="flex gap-4 flex-wrap w-full">
                    {tags.map((tag) => {
                        if (tag === "All") {
                            return null;
                        }
                        return (<label key={tag} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={tag}
                                {...register("tags")}
                                disabled={false}
                            />
                            <span>{tag}</span>
                        </label>)
                    })}
                </div>
                {errors.tags && errors.tags.message &&
                    <span className="text-rose-400 text-sm">Select at least one tag, max of 4</span>}
            </fieldset>
            <DynamicBlockNoteEditor onChange={onChange} initialContent={blog?.content ? blog.content : ''}/>
            {errors.content && errors.content.message &&
                <span className="text-rose-400 text-sm">{errors.content.message}</span>}
        </div>
        <div className="border-t pt-2">
            {errors.userId && errors.userId.message && <span className="text-rose-400 text-sm">Missing a userId</span>}
            {success && <Alert message={success} success/>}
            {error && <Alert message={error} error/>}
            <div className="flex items-center justify-between gap-6">
                <div>
                    <Button type="button" label="Delete"/>
                </div>
                <div className="flex gap-4">
                    <Button type="submit" label={isPublishing ? 'Publishing...' : 'Publish'} className="bg-blue-700"
                            onClick={handleSubmit(onPublish)}/>
                    <Button type="button" label={isSaving ? 'Saving...' : "Save as Draft"}
                            onClick={handleSubmit(onSaveDraft)}/>
                </div>
            </div>
        </div>
    </form>)
}

export default CreateBlogForm;