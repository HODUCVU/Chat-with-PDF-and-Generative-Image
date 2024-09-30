"use client";
import React, { ChangeEvent, useState } from 'react';
import ImageViewer from './ImageViewer';

import { saveAs } from 'file-saver';

type Props = {
    chatId: number;
};

const ChatGenerateImg: React.FC<Props> = ({ chatId }) => {
    const [prompt, setPrompt] = useState("");
    // const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageUrls, setImageUrl] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to handle the word wrapping
    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const words = value.split(/\s+/);
        const lines = [];
        for (let i = 0; i < words.length; i += 10) {
            lines.push(words.slice(i, i + 10).join(' '));
        }
        setPrompt(lines.join('\n'));
    };
    
    const generateImage = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/generate-image?prompt=${encodeURIComponent(prompt)}`);
            if (!res.ok) {
                throw new Error("Failed to generate image");
            }
            const data = await res.json();
            setImageUrl(prevUrls  => [...prevUrls, data.url]); // Add new image URL to the array
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from refreshing the page
        generateImage(); // Call the image generation function
    };

    // Function to trigger download
    const handleDownload = (url: string, index: number) => {
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `image-${index}.png`;
        // a.click();
        saveAs(url, `image-${index}.png`)
    };

    return (
        <div className='flex h-full w-full bg-white rounded-lg shadow-md'>
            {/* Left Side - Input Form */}
            <div className='flex-[2] flex flex-col p-6 bg-gray-100 rounded-l-lg shadow'>
                <div className='p-4 bg-green-600 text-white rounded-lg shadow mb-4'>
                    <h3 className='text-xl font-bold'>Create some Images</h3>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <textarea
                        value={prompt}
                        onChange={handleTextChange}
                        className='pt-5 p-3 border-t-2 border-gray-300 border-b border-l border-r rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4'
                        placeholder='Generate an image...'
                        rows={5}
                        style={{ resize: 'vertical' }}
                    />
                    <button
                        type='submit'
                        className={`p-3 rounded-md transition duration-300 shadow-md ${
                            loading
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-blue-600'
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Image"}
                        
                    </button>
                </form>
                {error && <p className='text-red-500 mt-4'>{error}</p>}
            </div>

            {/* Right Side - Image Viewer */}
            <div className='flex-[3] bg-gray-200 border-l border-gray-300 p-4 rounded-r-lg overflow-y-auto'>
                {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                        <div key={index} className='relative mb-4'>
                            <ImageViewer image_url={url} onDownload={() => handleDownload(url, index)} />
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No images generated yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatGenerateImg;
