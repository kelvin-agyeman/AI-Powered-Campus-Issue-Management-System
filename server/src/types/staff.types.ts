import { z } from "zod";
import {
  updateProgressSchema,
  resolveIssueSchema,
} from "../validators/staff.validator";

// export type GetAssignedIssuesQuery = z.infer<
//   typeof getAssignedIssuesQuerySchema
// >;

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;

export type ResolveIssueInput = z.infer<typeof resolveIssueSchema>;
