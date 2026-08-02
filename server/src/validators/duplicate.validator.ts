import { z } from "zod";

export const duplicateAnalysisSchema = z.object({
  isDuplicate: z
    .boolean()
    .describe(
      "Set to true if the new issue matches or significantly overlaps with an existing open report.",
    ),

  duplicateScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Similarity score from 0 to 100. 0 means completely unique; 100 means an exact identical duplicate or describing the exact same localized incident.",
    ),

  duplicateIssueIndex: z
    .number()
    .describe(
      "The 0-based array index of the matching existing issue. If isDuplicate is false, this MUST be exactly -1.",
    ),

  reasoning: z
    .string()
    .describe(
      "A concise explanation detailing why this issue is or is not a duplicate, highlighting specific cross-references like location context or description overlaps.",
    ),
});

export type DuplicateAnalysisOutput = z.infer<typeof duplicateAnalysisSchema>;
