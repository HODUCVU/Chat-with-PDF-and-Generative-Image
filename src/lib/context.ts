// Embedded vectors from pinecone (Built before) 
// to openai api to make it understand context.
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { Pinecone } from "@pinecone-database/pinecone";

// Get similar vectors
// fileKey to get namespace like this: namespace = convertToAscii(fileKey);
export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    const pinecone = new Pinecone({ 
        apiKey: process.env.PINECONE_API_KEY! 
    })
    const index = await pinecone.index('chatpdf-pbl');

    try {
        const namespace = convertToAscii(fileKey);
        const queryResult = await index.namespace(namespace).query(
            {
                vector: embeddings,
                topK: 5, //  Get 5 best results
                includeMetadata: true,
            }
        );
        return queryResult.matches || [];
    } catch (err) {
        console.log('Error fetching embeddings:', err);
        throw err;
    }
}

// https://docs.pinecone.io/guides/data/query-data
// fileKey to get namespace like this: namespace = convertToAscii(fileKey);
export async function getContext(query: string, fileKey: string) {
    try {
        // convert user asked to vectors
        console.log('Converting user asked to vectors')
        const queryEmbeddings = await getEmbeddings(query)
        // Get similar embeddings vectors from pinecone with queryEmbeddings
        // Get 5 vectors
        const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)
        // console.log('matches', matches[0])
        const qualifyingDocs = matches.filter(
            (match) => match.score && match.score > 0.7 
            );
        // console.log('qualifyingDocs', qualifyingDocs[0])
        type Metadata = {
            text: string,
            pageNumber: number,
        }

        let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text);
        // console.log('doc', docs)
        return docs.join('\n').substring(0, 3000);
    } catch (err) {
        console.log('Error getting context:', err);
        throw err;
    }
}