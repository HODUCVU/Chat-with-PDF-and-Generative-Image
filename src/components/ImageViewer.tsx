import React from 'react';
import { HiMiniArrowDownTray } from "react-icons/hi2";

type Props ={
    image_url: string;
    onDownload: () => void;
}

const ImageViewer = ({ image_url, onDownload }: Props) => {
    return (
        <div className='relative mt-4'>
            <img src={image_url} alt='Generated' className='max-w-full h-auto rounded-md shadow-md' />
            {/* <button
                onClick={onDownload}
                className='absolute top-2 right-2 p-2 bg-gray-800 text-white rounded-full'
                title='Download Image'
            >
                <HiMiniArrowDownTray className="w-6 h-6"/>
            </button> */}
            <a
                onClick={onDownload}
                className='absolute top-2 right-2 p-2 bg-gray-800 text-white rounded-full'
                title='Download Image'
                download
            >
                <HiMiniArrowDownTray className="w-6 h-6"/>
            </a>
        </div>
    );
};
export default ImageViewer;