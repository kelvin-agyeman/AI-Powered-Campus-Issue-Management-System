import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .nonempty({ error: "Full name field cannot be blank" })
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(50, { error: "Name cannot exceed 50 characters" })
    .optional(),

  avatar: z.string().optional(),
  avatarPublicId: z.string().optional(),
});

export const updateEmailSchema = z.object({
  newEmail: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),
});

export const resendUpdatedEmailVerificationSchema = z.object({
  newEmail: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),
});

export const verifyUpdatedEmailSchema = z.object({
  newEmail: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),

  newVerificationToken: z
    .string()
    .trim()
    .length(80, {
      error: "Invalid verification token",
    })
    .regex(/^[a-f0-9]+$/, {
      error: "Invalid verification token",
    }),
});

export const sendEditDetailsRequestSchema = z.object({
  newInstitutionId: z
    .string()
    .trim()
    .toUpperCase()
    .length(8, { error: "Institution ID must be exactly 8 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      error: "Institution ID must contain only letters and numbers",
    }),

  reason: z
    .string()
    .trim()
    .nonempty({ error: "Please provide a reason for this request" })
    .min(10, { error: "Reason must be at least 10 characters long" })
    .max(500, { error: "Reason cannot exceed 500 characters" }),
});
