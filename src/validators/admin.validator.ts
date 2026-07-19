import { z } from "zod";
import {
  ISSUE_CATEGORIES,
  PRIORITY_LEVELS,
  ASSIGNABLE_DEPARTMENTS,
} from "../utils/constants";

export const modifyIssueSchema = z.object({
  category: z
    .enum(ISSUE_CATEGORIES, {
      message: "Please select a valid issue category.",
    })
    .optional(),

  priority: z
    .enum(PRIORITY_LEVELS, {
      message: "Please select a valid priority level.",
    })
    .optional(),

  department: z
    .enum(ASSIGNABLE_DEPARTMENTS, {
      message: "Please select a valid department.",
    })
    .optional(),
});

export const rejectIssueSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "Reason must be at least 10 characters.")
    .max(500, "Reason cannot exceed 500 characters."),
});

export const assignStaffSchema = z.object({
  staffId: z.string().trim().min(1, "Staff member is required."),
});

// export const filterIssuesSchema = z.object({
//   status: z.string().optional(),
//   assignedDepartment: z.enum(ASSIGNABLE_DEPARTMENTS).optional(),
//   priority: z.enum(PRIORITY_LEVELS).optional(),
//   category: z.enum(ISSUE_CATEGORIES).optional(),
//   reportedBy: z.string().optional(),
//   assignedStaff: z.string().optional(),
//   aiStatus: z.enum(["pending", "processing", "completed", "failed"]).optional(),
//   adminDecision: z.enum(["approved", "modified", "rejected"]).optional(),
//   date: z.string().optional(),
// });
