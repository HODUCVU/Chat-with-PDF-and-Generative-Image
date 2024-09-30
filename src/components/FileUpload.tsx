'use client'
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React from 'react';
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';
const FileUpload = () => {

    // When receiving pdf file => create chat
    const router = useRouter();

    const [uploading, setUploading] = React.useState(false);
    const {mutate, isPending} = useMutation({
        mutationFn: async ({
            file_key, 
            file_name
        } : {
            file_key: string, 
            file_name: string
        }) => {
            // route create-chat post
            const response = await axios.post('/api/create-chat', {
                file_key, file_name
            });
            return response.data;
        }
    })

    const {getRootProps, getInputProps} = useDropzone({
        accept: {'application/pdf': ['.pdf']},
        maxFiles:1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0]
            if (file.size > (10 * 1024 * 1024)) {
                // bigger than 10MB
                toast.error("File too large")
                return
            }
            try {
                // When uploading, show processing
                setUploading(true)
                // Push pdf on AWS S3
                const data = await uploadToS3(file)
                if (!data!.file_key || !data!.file_name) {
                    toast.error("Something went wrong uploading");
                    return;
                }
                // route to create-chat
                mutate(data!, {
                    onSuccess: ({chat_id}) => {
                        toast.success("Chat created!")
                        router.push(`/chat/${chat_id}`);
                    },
                    onError: (error) => {
                        toast.error("Error creating chat");
                        console.log(error);
                    },
                })
            } catch (e) {
                console.log(e, "in FileUpload")
            } finally {
                setUploading(false) // hide processing after upload
            }
            
        },
    })
    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 via-gray-100 to-white rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
            <div
                {...getRootProps({
                className: 'border-dashed border-2 border-blue-300 rounded-xl cursor-pointer bg-white py-16 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors duration-300'
                })}
            >
                <input {...getInputProps()} />
                {(uploading || isPending) ? (
                    <>
                        {/* Loading state */}
                        <Loader2 className='h-10 w-10 text-blue-500 animate-spin'/>
                        <p className='mt-2 text-sm text-slate-400'>
                            Spilling Tea to GPT...
                        </p>

                    </>
                ):(
                    <>
                        <Inbox className="w-16 h-16 text-blue-500 mb-4" aria-hidden="true" />
                        <p className="text-xl text-gray-700 font-semibold">Drag & Drop PDF Files Here</p>
                        <p className="mt-2 text-sm text-gray-500">or click to select files</p>
            
                    </>
                )}
                </div>
        </div>
    );
}

export default FileUpload;