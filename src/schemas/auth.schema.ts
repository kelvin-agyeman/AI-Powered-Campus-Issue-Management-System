import { z } from "zod";
import { KNUST_DEPARTMENTS } from "../utils/departments";

export const registerStudentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .nonempty({ error: "Full name is required" })
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(50, { error: "Name cannot exceed 50 characters" }),

  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),

  institutionId: z
    .string()
    .trim()
    .length(8, { error: "Student ID must be exactly 8 characters long" })
    .regex(/^\d+$/, { error: "Student ID must contain only numbers" }),

  password: z
    .string()
    .nonempty({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      error: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "Password must contain at least one special character",
    }),
});

export const registerStaffSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(50, { error: "Name cannot exceed 50 characters" }),

  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),

  institutionId: z
    .string()
    .trim()
    .toUpperCase()
    .length(8, { error: "Staff ID must be exactly 8 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      error: "Staff ID must contain only letters and numbers",
    }),

  department: z.enum(KNUST_DEPARTMENTS, { error: "Invalid department" }),

  password: z
    .string()
    .nonempty({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      error: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "Password must contain at least one special character",
    }),
});

export const verifyEmailSchema = z.object({
  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),

  verificationToken: z
    .string()
    .trim()
    .length(80, {
      error: "Invalid verification token",
    })
    .regex(/^[a-f0-9]+$/, {
      error: "Invalid verification token",
    }),
});

export const resendVerificationEmailSchema = z.object({
  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),
});

export const loginUserSchema = z.object({
  institutionId: z
    .string()
    .trim()
    .toUpperCase()
    .nonempty({
      error: "Institution ID is required",
    })
    .length(8, {
      error: "Institution ID must be exactly 8 characters long",
    }),

  password: z.string().nonempty({ error: "Password is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),
});

export const resetPasswordSchema = z.object({
  email: z
    .email({
      error: "Please provide a valid email address",
    })
    .trim()
    .toLowerCase(),

  resetPasswordToken: z
    .string()
    .trim()
    .length(140, {
      error: "Invalid reset password token",
    })
    .regex(/^[a-f0-9]+$/, {
      error: "Invalid reset password token",
    }),

  password: z
    .string()
    .nonempty({
      error: "Password is required",
    })
    .min(8, {
      error: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      error: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "Password must contain at least one special character",
    }),
});

export const registerAdminSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(50, { error: "Name cannot exceed 50 characters" }),

  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase(),

  institutionId: z
    .string()
    .trim()
    .toUpperCase()
    .length(8, { error: "Admin ID must be exactly 8 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      error: "Admin ID must contain only letters and numbers",
    }),

  password: z
    .string()
    .nonempty({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      error: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "Password must contain at least one special character",
    }),
});
