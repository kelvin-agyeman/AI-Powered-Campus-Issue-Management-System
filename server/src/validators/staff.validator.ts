import { z } from "zod";
import {
  ISSUE_STATUSES,
} from "../utils/constants";

// export const getAssignedIssuesQuerySchema = z.object({
//   status: z.enum(ISSUE_STATUSES).optional(),
//   priority: z.enum(PRIORITY_LEVELS).optional(),
//   category: z.enum(ISSUE_CATEGORIES).optional(),
// });

export const updateProgressSchema = z.object({
  note: z.string().min(1, "Progress note is required"),
  status: z.enum(ISSUE_STATUSES).optional(),
});

export const resolveIssueSchema = z.object({
  resolutionNotes: z.string().min(1, "Resolution notes are required"),
  resolutionImages: z
    .array(
      z.object({
        url: z.url(),
        publicId: z.string(),
      }),
    )
    .optional()
    .default([]),
});
