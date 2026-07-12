import { createLLM } from "./llm";
import { aiAnalysisSchema, AIAnalysisOutput } from "../../schemas/ai.schema";
import { buildIssueAnalysisPrompt } from "./promptBuilder";
import {
  ASSIGNABLE_DEPARTMENTS,
  PRIORITY_LEVELS,
  ISSUE_CATEGORIES,
  AI_MODELS,
} from "../../utils/constants";

export const analyzeIssue = async (
  description: string,
  location: string,
): Promise<{
  aiRecommendation: AIAnalysisOutput["aiRecommendation"];
  resolutionSupport: AIAnalysisOutput["resolutionSupport"];
  model: string;
}> => {
  const prompt = await buildIssueAnalysisPrompt().format({
    description,
    location,
    allowedCategories: ISSUE_CATEGORIES.join(", "),
    allowedDepartments: ASSIGNABLE_DEPARTMENTS.join(", "),
    allowedPriorities: PRIORITY_LEVELS.join(", "),
  });

  let lastError: unknown;

  for (const model of AI_MODELS) {
    try {
      console.log(`Trying AI model: ${model}`);

      const llm = createLLM(model);
      const structuredLLM = llm.withStructuredOutput(aiAnalysisSchema, {
        name: "analyze_campus_issue",
      });

      const result = await structuredLLM.invoke(prompt);
      console.log(`AI Success -> ${model}`);

      return {
        aiRecommendation: result.aiRecommendation,
        resolutionSupport: result.resolutionSupport,
        model,
      };
    } catch (error) {
      console.error(`Model ${model} failed execution. Attempting fallback...`);
      lastError = error;
    }
  }

  throw lastError;
};
