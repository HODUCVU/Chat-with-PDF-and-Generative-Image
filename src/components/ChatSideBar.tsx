'use client'
import { DrizzleChat } from '@/lib/db/schema';
import { MessageCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
    chats: DrizzleChat[];
    chatId: number;
}

const ChatSideBar = ({chats, chatId}: Props) => {
    return(
        <div className="w-full h-screen p-4 text-gray-200 bg-gray-900 flex flex-col">

            <Link href='/'>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
                    <PlusCircle className='mr-2 w-5 h-5'/>
                    New Chat
                </button>
            </Link>

            <div className="flex flex-col gap-4 mt-6">
                {chats.map(chat => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-200 ${chat.id === chatId ? 'bg-yellow-500' : 'hover:bg-gray-800'}`}>
                            <MessageCircle className="mr-2 text-blue-400" width={20} height={20}/>
                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                                {chat.pdfName}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className='absolute bottom-4 left-4'>
                <div className='flex items-center gap-4 p-2 bg-gray-800 text-sm text-slate-300 rounded-lg shadow-md'>
                    <Link href='/' className='hover:text-blue-400 transition duration-200'>Home</Link>
                    <Link href='/' className='hover:text-blue-400 transition duration-200'>Source</Link>
                </div>
            </div>

        </div>
    );
}

export default ChatSideBar;