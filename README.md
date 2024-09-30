# Chat with PDF and Generative Image
![image](https://github.com/user-attachments/assets/5d12d6cc-1cd3-4603-9484-6fa8318f2b13)
## Chat with PDF
- Using `text-embedding-ada-002` model to convert pdf file to vertor and store it on pinecone.
- Using `gpt-3.5-turbo` model to chat with user and analysis pdf file content.
- Users can chat with the chatbot to learn more about the contents of the PDF file...
![image](https://github.com/user-attachments/assets/eed58621-8b82-4116-8375-ac49d97f52d6)
## Generative Image
- Using `DALL-E 2` model from openai api to generative image.
- User can create a list of image by prompt input.
![image](https://github.com/user-attachments/assets/38667d00-ff90-44d9-85a1-7cf67d3474d6)


## Getting Started
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
