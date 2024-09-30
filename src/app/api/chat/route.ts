import {Configuration, OpenAIApi} from 'openai-edge'
import {Message, OpenAIStream, StreamingTextResponse} from 'ai'
import { getContext } from '@/lib/context'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!,
})

const openai = new OpenAIApi(config)

// Post user messages
export async function POST(req: Request) {
    try {
        // Get content from user request (Message input)
        const {messages, chatId} = await req.json();
        // Why don't we transfer currentUser, but we transfer chatId?
        // Query database to get file_key from chatId
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
        if (_chats.length != 1) {
            return NextResponse.json({'Error': 'Chat not found'}, {status: 404})
        }
        const fileKey = _chats[0].fileKey
        // Get context of PDF document
        const lastMessage = messages[messages.length - 1];
        // console.log(lastMessage) 
        // console.log(lastMessage.content)
        // console.log(fileKey, typeof fileKey === 'string')
        
        const context = await getContext(lastMessage.content, fileKey);
        const systemMessage  = {
            role: "system",
            content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
          The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
          AI is a well-behaved and well-mannered individual.
          AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
          AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
          AI assistant is a big fan of Pinecone and Vercel.
          START CONTEXT BLOCK
          ${context}
          END OF CONTEXT BLOCK
          AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
          If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
          AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
          AI assistant will not invent anything that is not drawn directly from the context.
          `
          };
        const chatMessages = [
            systemMessage,
            ...messages.filter((message: Message) => message.role === 'user')
        ];
        // Ask chatGPT
        const response = await openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: chatMessages,
                stream: true // send token by token, instead of waiting for the entire completion to be ready before sending response
            }
        );
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (err) {
        console.error('Error parsing request body:', err)
        return new Response(
            JSON.stringify({ error: 'Invalid request body' }), 
            { status: 400 }
        )
    }
}