'use client'
import React from 'react';
// npm install ai =? install vercal AI SDK
// https://sdk.vercel.ai/docs/foundations/overview
import {useChat} from 'ai/react';
import MessageList from './MessageList';
type Props = {
    chatId: number;
};

const ChatComponent = ({chatId}: Props) => {

    const {input, handleInputChange, handleSubmit, messages} = useChat({
        api: '/api/chat', // route to chatgpt to get answer from vercal AI SDK
        body: { // pass variables to chat (chat route)
            chatId
        }
    });
    return (
        <div className='flex flex-col h-full w-full bg-white rounded-lg shadow-md'>
            {/* Header */}
            <div className='p-4 bg-blue-600 text-white rounded-t-lg shadow'>
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>

            {/* Message List */}
            <MessageList messages={messages} />

            {/* Input Form */}
            <form onSubmit={handleSubmit} className='flex items-center p-2 bg-gray-100 rounded-b-lg shadow'>
                <input
                    type='text'
                    value={input}
                    onChange={handleInputChange}
                    className='flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                    placeholder='Ask any question...'
                />
                <button
                    type='submit'
                    className='ml-2 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 shadow-md'
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;