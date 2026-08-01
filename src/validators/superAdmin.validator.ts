import { z } from "zod";
import { KNUST_DEPARTMENTS } from "../utils/constants";

export const registerAdminSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(50, { error: "Name cannot exceed 50 characters" }),

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

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(50, { error: "Name cannot exceed 50 characters" })
    .optional(),

  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .toLowerCase()
    .optional(),

  institutionId: z
    .string()
    .trim()
    .toUpperCase()
    .length(8, { error: "Staff ID must be exactly 8 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      error: "Staff ID must contain only letters and numbers",
    })
    .optional(),

  department: z
    .enum(KNUST_DEPARTMENTS, { error: "Invalid department" })
    .optional(),
});

export const broadcastSchema = z.object({
  title: z.string().trim().min(1, { error: "Broadcast title is required" }),

  message: z.string().trim().min(1, { error: "Broadcast error is required" }),

  targetAudience: z.enum(["all", "students", "staff", "admins"], {
    error: "Target audience must be 'all', 'students', 'staff', or 'admins'",
  }),
});
