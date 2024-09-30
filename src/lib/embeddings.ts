// Step 3: Embed Document to pinecone - create vectors from pdf
// Relative OPENAI API
// npm install openai-edge
// https://openai.com/api/pricing/
import {OpenAIApi, Configuration} from 'openai-edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!,
})

const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string) {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        })
        const result = await response.json()
        return result.data[0].embedding as number[]; // vector
    }catch(err) {
        console.log("Error calling openai embeddings api", err)
        throw err
    }
}
