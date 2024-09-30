import ChatGenrateImg from '@/components/ChatGenerateImg';
import ChatSideBar from '@/components/ChatSideBar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import {PlusCircle } from 'lucide-react';
import Link from 'next/link';

type Props = {
    params: {
        chatId: string;
    };
};

const GenerateImage = async ({params: {chatId} }: Props) => {
    const {userId} = await auth()
    // check if user is authenticated
    if (!userId) {
        return redirect('/sign-in');
    }
    return (
        <div className="flex h-screen overflow-hidden">
            <div className='flex w-full h-full'>

            {/* chat side */}
            <div className='flex-[1] max-w-xs'>
                {/* <ChatSideBar chats={parseInt(chatId)} chatId={parseInt(chatId)}/> */}
                <div className="w-full h-screen p-4 text-gray-200 bg-gray-900 flex flex-col">

                    <Link href='/'>
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
                            <PlusCircle className='mr-2 w-5 h-5'/>
                            New Chat
                        </button>
                    </Link>
                    
                </div>
            </div>

            {/* Chat Component */}
            <div className='flex-[9] bg-white p-4 border-l border-gray-300 flex-grow'>
                    <ChatGenrateImg chatId={parseInt(chatId)}/>
            </div>
            
            </div>
        </div>
    );
}

export default GenerateImage;