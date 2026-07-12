import { ChatOpenAI } from "@langchain/openai";

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("Missing OPENROUTER_API_KEY environment variable");
}

export const createLLM = (model: string) => {
  return new ChatOpenAI({
    model,
    temperature: 0,
    maxRetries: 2,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
        "X-Title": "AI-Powered Campus Issue Management System",
      },
    },
  });
};
