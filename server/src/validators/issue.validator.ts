import { z } from "zod";

export const createIssueSchema = z.object({
  description: z
    .string()
    .trim()
    .nonempty({ error: "Description is required" })
    .min(10, { error: "Description must be at least 10 characters long" }),

  location: z
    .string()
    .trim()
    .nonempty({ error: "Location details are required" }),
});

export const updateIssueSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, { error: "Description must be at least 10 characters long" })
    .optional(),

  location: z.string().trim().optional(),
});
