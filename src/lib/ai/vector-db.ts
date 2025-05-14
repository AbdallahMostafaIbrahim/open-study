// import { Pinecone } from "@pinecone-database/pinecone";
// import { env } from "~/env";

// let pinecone: Pinecone;

// export async function initPinecone() {
//   if (pinecone) return pinecone;
//   pinecone = new Pinecone({ apiKey: env.PINECONE_API_KEY });
//   return pinecone;
// }

// export async function upsertEmbeddings(
//   embeddings: {
//     content: string | undefined;
//     embedding: Array<number>;
//   }[],
//   fileId: string,
// ) {
//   const client = await initPinecone();
//   const index = client.index(env.PINECONE_INDEX_NAME);

//   // Pinecone expects vectors in the form { id, values, metadata }
//   const vectors = embeddings.map((e, i) => ({
//     id: `${fileId}::${i}`,
//     values: e.embedding,
//     metadata: {
//       fileId,
//       chunkIndex: i,
//       text: e.content!,
//     },
//   }));

//   await index.upsert(vectors);
// }

// export async function findMatches(
//   userQuery: Array<number>,
//   fileIds: string[],
//   topK: number,
// ) {
//   const client = await initPinecone();
//   const index = client.index(env.PINECONE_INDEX_NAME);

//   const result = await index.query({
//     vector: userQuery,
//     topK,
//     includeMetadata: true,
//     filter: {
//       fileId: {
//         $in: fileIds,
//       },
//     },
//   });

//   return result;
// }
export {};
