import { ChatGroq } from "@langchain/groq";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY environment variable");
}

export const createLLM = (model: string) => {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model,
    temperature: 0,
    maxRetries: 2,
  });
};