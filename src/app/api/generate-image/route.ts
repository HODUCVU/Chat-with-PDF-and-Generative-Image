import type { NextRequest } from "next/server";
import {Configuration, OpenAIApi, ResponseTypes} from "openai-edge";

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(config);

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);

    try {
        const image = await openai.createImage({
            prompt: searchParams.get('prompt') ?? "A cute baby sea otter",
            n: 1,
            size: "512x512", // 1024x1024, 512x512
            response_format: "url",
        })
        const data = (await image.json()) as ResponseTypes["createImage"]
        const url = data.data?.[0]?.url
        return new Response(JSON.stringify({url}), {
            status: 200,
            headers: {
                "content-type": "application/json",
            }
        })
    } catch (error: any) {
        console.error(error)
        return new Response(JSON.stringify(error), {
            status: 400,
            headers: {
                "content-type": "application/json",
            }
        })
    }
}
