import mongoose from "mongoose";
import Issue from "../../models/Issue";
import { createLLM } from "../ai/llm";
import { duplicateAnalysisSchema } from "../../validators/duplicate.validator";
import { buildDuplicateDetectionPrompt } from "./duplicatePromptBuilder";
import { AI_MODELS } from "../../utils/constants";

export const detectDuplicate = async (
  newIssueId: mongoose.Types.ObjectId | string,
  description: string,
  location: string,
  category?: string,
  priority?: string,
  summary?: string,
): Promise<{
  duplicateAnalysis: {
    isDuplicate: boolean;
    duplicateScore: number;
    reasoning: string;
    possibleDuplicateOf: mongoose.Types.ObjectId | null;
  };
  model: string;
} | null> => {
  const recentIssues = await Issue.find({
    _id: { $ne: newIssueId },
    isDeleted: false,
    status: { $ne: "rejected" },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("description location aiRecommendation");

  if (recentIssues.length === 0) {
    return null;
  }

  const existingIssuesList = recentIssues
    .map((issue, index) => {
      return `[Index: ${index}]
Location: ${issue.location}
Description: ${issue.description}
Category: ${issue.aiRecommendation?.category || "N/A"}
Priority: ${issue.aiRecommendation?.priority || "N/A"}
Summary: ${issue.aiRecommendation?.summary || "N/A"}`;
    })
    .join("\n---------------------------\n");

  const prompt = await buildDuplicateDetectionPrompt().format({
    existingIssuesList,
    newLocation: location,
    newDescription: description,
    newCategory: category || "N/A",
    newPriority: priority || "N/A",
    newSummary: summary || "N/A",
  });

  let lastError: unknown;

  for (const model of AI_MODELS) {
    try {
      console.log(`Trying AI model: ${model}`);

      const llm = createLLM(model);
      const structuredLLM = llm.withStructuredOutput(duplicateAnalysisSchema, {
        name: "analyze_duplicate_issue",
      });

      const result = await structuredLLM.invoke(prompt);
      console.log(`AI Success -> ${model}`);

      let possibleDuplicateOf: mongoose.Types.ObjectId | null = null;

      if (
        result.isDuplicate &&
        result.duplicateIssueIndex >= 0 &&
        result.duplicateIssueIndex < recentIssues.length
      ) {
        possibleDuplicateOf = recentIssues[result.duplicateIssueIndex]
          ._id as mongoose.Types.ObjectId;
      } else {
        result.isDuplicate = false;
      }

      return {
        duplicateAnalysis: {
          isDuplicate: result.isDuplicate,
          duplicateScore: result.duplicateScore,
          reasoning: result.reasoning,
          possibleDuplicateOf,
        },
        model,
      };
    } catch (error) {
      console.error(`Model ${model} failed execution. Attempting fallback...`);
      lastError = error;
    }
  }

  throw lastError;
};
