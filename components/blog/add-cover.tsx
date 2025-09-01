"use client"

import {useEdgeStore} from "@/lib/edgestore";
import {useEffect, useRef, useState} from "react";
import {ImageIcon} from "lucide-react";

interface AddCoverProps {
    setUploadedCover: (cover: string) => void;
    replaceUrl?: string
}

const AddCover = ({setUploadedCover, replaceUrl}: AddCoverProps) => {
    const imgRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const {edgestore} = useEdgeStore();

    const handleUpload = () => imgRef.current?.click();

    useEffect(() => {
        let isMounted = true;
        const uplodadFile = async () => {
            if (!file) {
                return;
            }
            setIsUploading(true);

            try {
                const res = await edgestore.publicFiles.upload({
                    file,
                    options: replaceUrl ? {replaceTargetUrl: replaceUrl} : undefined
                })

                if (isMounted && res.url) {
                    setUploadedCover(res.url);
                }
            } catch (e) {
                console.error('Upload failed', e)
            } finally {
                if (isMounted) {
                    setIsUploading(false);
                }
                setIsUploading(false);
            }
        }

        uplodadFile();

        return () => {
            isMounted = false;
        }
    }, [file, edgestore, replaceUrl, setUploadedCover])

    return (<div>
        <input
            type="file"
            accept="image/*"
            ref={imgRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
        />
        <button type="button" onClick={handleUpload} className="flex items-center gap-2">
            <ImageIcon size={20}/>
            <span>
                {!!replaceUrl ? "Replace Cover" : "Add Cover"}
            </span>
        </button>
        {isUploading && <p className="text-green-500">Uploading</p>}
    </div>)
}

export default AddCover;