import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// api/create-chat
export async function POST(req: Request, res: Response) {
    const {userId} = await auth()
    if(!userId) {
        return NextResponse.json({error: 'unauthenticated'},{status: 401});
    }
    try {
        const body = await req.json();
        // from data in FileUpload
        const {file_key, file_name} = body;
        // Load pdf to pinecone
        await loadS3IntoPinecone(file_key);
        // Create new chat
        const chat_id = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId: userId, // replace with your user id
        }).returning({
            insertedId: chats.id
        });
        // Return a success response
        return NextResponse.json(
            {
                chat_id: chat_id[0].insertedId,
            },
            {
                status: 200
            }
        )

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                error: "internal server error",
            },
            {
                status: 500
            }
        );
    }

}