'use client'

import {useForm} from "react-hook-form";
import {BlogSchema, BlogSchemaType} from "@/schemas/blog-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import FormField from "@/components/common/form-field";
import AddCover from "@/components/blog/add-cover";
import {useState} from "react";
import CoverImage from "@/components/blog/cover-image";

const CreateBlogForm = () => {

    const session = useSession();
    const userId = session.data?.user.userId;
    const [uploadedCover, setUploadedCover] = useState<string>();

    const {register, handleSubmit, formState: {errors}, setValue} = useForm<BlogSchemaType>({
        resolver: zodResolver(BlogSchema),
        defaultValues: {
            userId,
            isPublished: false
        }
    });

    return (<form className="flex flex-col justify-between max-w-[1200px] m-auto min-h-[85vh]">
        <div>
            {!!uploadedCover && <CoverImage url={uploadedCover} isEditor={true} setUploadedCover={setUploadedCover}/>}
            <AddCover setUploadedCover={setUploadedCover}/>
            <FormField
                id="title"
                register={register}
                errors={errors}
                placeholder="Blog Title"
                disabled={false}
                inputClassNames="border-none text-5x1 font-bold bg-transparent px-o"
            />
            <FormField
                id="title"
                register={register}
                errors={errors}
                placeholder="Blog Title"
                disabled={false}
            />
        </div>
    </form>)
}

export default CreateBlogForm;