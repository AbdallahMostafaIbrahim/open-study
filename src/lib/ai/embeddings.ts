import { openai } from "@ai-sdk/openai";
import type { ScoredVector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";
import { embed, embedMany } from "ai";
import pdfParse from "pdf-parse";
import { downloadFileFromKey } from "../storage";
// import { findMatches, upsertEmbeddings } from "./vector-db";

const embeddingModel = openai.embedding("text-embedding-ada-002");

const generateChunks = (input: string): string[] => {
  return input
    .split(/\s+/)
    .reduce(
      (chunks: string[], word: string) => {
        const lastChunk = chunks[chunks.length - 1];
        if ((lastChunk?.length || 0) + word.length + 1 <= 1000) {
          chunks[chunks.length - 1] += ` ${word}`;
        } else {
          chunks.push(word);
        }
        return chunks;
      },
      [""],
    )
    .filter((chunk) => chunk.length > 0);
};

export const generateEmbeddings = async (value: string) => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (
  userQuery: string,
  fileKeys: string[],
) => {
  // const userQueryEmbedded = await generateEmbedding(userQuery);
  // try {
  //   const result = await findMatches(userQueryEmbedded, fileKeys, 5);
  //   return result.matches || [];
  // } catch (e) {
  //   console.log("Error querying embeddings: ", e);
  //   throw new Error(`Error querying embeddings: ${e}`);
  // }
};

// export const getContext = async (
//   message: string,
//   maxTokens = 3000,
//   minScore = 0.7,
//   fileKeys: string[] = [],
// ): Promise<string | ScoredVector[]> => {
//   // Retrieve the matches for the embeddings from the specified namespace
//   const matches = await findRelevantContent(message, fileKeys);

//   // Filter out the matches that have a score lower than the minimum score
//   const qualifyingDocs = matches.filter((m) => m.score && m.score > minScore);

//   let docs = matches
//     ? qualifyingDocs.map((match) => (match.metadata as { chunk: string }).chunk)
//     : [];

//   return docs.join("\n").substring(0, maxTokens);
// };

export const generateEmbeddingsFromPdf = async (fileKey: string) => {
  const pdfData = await downloadFileFromKey(fileKey);

  const { text } = await pdfParse(pdfData);

  const embeddings = await generateEmbeddings(text);

  // await upsertEmbeddings(embeddings, fileKey);
};
