import { Pinecone,
    PineconeRecord,} from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf';
import {Document, 
    RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertToAscii } from './utils';

let pinecone: Pinecone | null = null;
const api = process.env.PINECONE_API_KEY || '';

export const getPineconeClient = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: api,
        });
    }
    return pinecone;
}
type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber: number}
    }
}
// Called on route api
export async function loadS3IntoPinecone(fileKey: string) {
    // 1. Obtain the pdf from s3 -> download and read from pdf
    console.log('downloading s3 into file...');
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error("Could not download from s3");
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    
    // 2. Split and Segments the pages - using pinecone splitter
    // page is array[13] -> documents array[1000]
    const documents = await Promise.all(pages.map(prepareDocument));

    // 3. Vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // 4. Upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index("chatpdf-pbl");

    console.log('Inserting vector into pinecone')
    const namespace = convertToAscii(fileKey);

    // Push vectors to Pinecone index
    await pineconeIndex.namespace(namespace).upsert(vectors);
    return documents[0];
}

// Step 3
async function embedDocument(doc:Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent)
        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber,
            },
        } as PineconeRecord;
    } catch (err) {
        console.error(`Error embedding document:`, err);
        throw err;
    }
}


export const truncateStringByButes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

// Step 2
async function prepareDocument(page: PDFPage) {
    let {pageContent, metadata} = page;
    pageContent = pageContent.replace(/\n/g, '') // each sentence
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByButes(pageContent, 36000)
            }
        }),
    ])
    return docs;
}


