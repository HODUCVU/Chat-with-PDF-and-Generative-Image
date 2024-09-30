import ChatComponent from '@/components/ChatComponent';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
    params: {
        chatId: string;
    };
};

const ChatPage = async ({params: {chatId} }: Props) => {
    const {userId} = await auth()
    // check if user is authenticated
    if (!userId) {
        return redirect('/sign-in');
    }
    // Create sidebar chat
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    if (!_chats) {
        return redirect('/');
    }
    if (!_chats.find(chat=>chat.id == parseInt(chatId))) {
        return redirect('/');
    }

    // Get pdf url
    const currentChat = _chats.find(chat => chat.id === parseInt(chatId));
    
    return (
        <div className="flex h-screen overflow-hidden">
            <div className='flex w-full h-full'>
                
                {/* Chat sidebar */}
                <div className='flex-[1] max-w-xs'>
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)}/>
                </div>

                {/* PDF viewer */}
                <div className='flex-[4] bg-gray-100 border-l border-r border-gray-300 p-4 overflow-y-auto'>
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <PDFViewer pdf_url={currentChat?.pdfUrl || ""}/>
                    </div>
                </div>

                {/* Chat component */}
                <div className='flex-[5] bg-white p-4 border-l border-gray-300 flex-grow'>
                    <ChatComponent chatId={parseInt(chatId)}/>
                </div>

            </div>
        </div>
    );
}

export default ChatPage;