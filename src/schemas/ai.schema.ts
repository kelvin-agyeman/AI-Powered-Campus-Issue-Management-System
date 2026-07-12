import { z } from "zod";

export const aiAnalysisSchema = z.object({
  aiRecommendation: z.object({
    category: z
      .string()
      .describe(
        "The selected category for the issue from the provided list of allowed categories.",
      ),
    department: z
      .string()
      .describe(
        "The selected department to handle the issue from the provided list of allowed departments.",
      ),
    priority: z
      .string()
      .describe(
        "The assigned priority level from the provided list of allowed priorities.",
      ),
    confidenceScore: z
      .number()
      .int()
      .min(0)
      .max(100)
      .describe(
        "Your confidence score for this classification, from 0 to 100.",
      ),
    summary: z
      .string()
      .describe(
        "A concise, professional 1-2 sentence summary of the reported issue. This acts as the issue's title.",
      ),
    duplicateScore: z
      .number()
      .int()
      .min(0)
      .max(100)
      .describe(
        "Likelihood of this being a duplicate issue. Default this to 0 for now.",
      ),
    reasoning: z
      .string()
      .describe(
        "A brief, logical explanation of why you selected the specific category, department, and priority.",
      ),
    requiresHumanReview: z
      .boolean()
      .describe(
        "Set to true ONLY if the issue is a severe emergency, poses a security/safety risk, or is highly ambiguous.",
      ),
  }),

  resolutionSupport: z.object({
    recommendedAction: z
      .string()
      .describe(
        "Step-by-step recommendation or initial action plan for the assigned staff to resolve the issue.",
      ),
    requiredResources: z
      .array(z.string())
      .describe(
        "A list of tools, materials, or specific personnel required (e.g., ['Pipe wrench', 'Sealant', 'Plumber']). Return an empty array if none are obvious.",
      ),
    estimatedResolutionTime: z
      .string()
      .describe(
        "A realistic estimate of how long this issue will take to resolve (e.g., '2-4 hours', '1-2 business days').",
      ),
    safetyNotes: z
      .array(z.string())
      .describe(
        "Any safety precautions or warnings the staff should take before or during resolution. Return an empty array if no safety risks are present.",
      ),
  }),
});

export type AIAnalysisOutput = z.infer<typeof aiAnalysisSchema>;
