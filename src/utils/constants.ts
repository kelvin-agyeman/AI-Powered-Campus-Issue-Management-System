export const KNUST_DEPARTMENTS = [
  "Academic Affairs",
  "Accra Office",
  "Basic Schools",
  "Development Office",
  "Environment and Sanitation",
  "Estate Organisation",
  "Finance Office",
  "Fire Management",
  "Health Services",
  "Human Resource Development",
  "Information Technology Services",
  "Institute of Distance Learning",
  "Legal Services",
  "Municipal Services",
  "Obuasi Campus Administration",
  "Office of Grants and Research",
  "Procurement Office",
  "Quality Assurance and Planning",
  "School of Graduate Studies",
  "Security Services",
  "Student Affairs",
  "Transport Department",
  "University Hospital",
  "University Library",
  "University Printing Press",
  "University Relations",
  "Vice-Chancellor's Office",
  "Works and Physical Development",
] as const;

export const ASSIGNABLE_DEPARTMENTS = [
  "Environment and Sanitation",
  "Estate Organisation",
  "Fire Management",
  "Health Services",
  "Information Technology Services",
  "Municipal Services",
  "Security Services",
  "Student Affairs",
  "Transport Department",
  "Works and Physical Development",
  "Other",
] as const;

export const PRIORITY_LEVELS = ["low", "medium", "high", "critical"] as const;

export const ISSUE_STATUSES = [
  "pending_admin_review",
  "approved",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
] as const;

export const ISSUE_CATEGORIES = [
  "Electricity",
  "Water Supply",
  "Roads",
  "Drainage",
  "Sanitation",
  "Security",
  "Fire",
  "Buildings",
  "ICT",
  "Transport",
  "Health",
  "Other",
] as const;

export const AI_MODELS = [
  "llama-3.3-70b-versatile", // Primary
  "openai/gpt-oss-120b", // Fallback 1
  "llama-3.1-8b-instant", // Fallback 2
  "meta-llama/llama-4-scout-17b-16e-instruct", // Fallback 3
] as const;

export const NOTIFICATION_TYPES = {
  ISSUE_CREATED: "ISSUE_CREATED",
  ISSUE_APPROVED: "ISSUE_APPROVED",
  ISSUE_REJECTED: "ISSUE_REJECTED",
  ISSUE_ASSIGNED: "ISSUE_ASSIGNED",
  ISSUE_IN_PROGRESS: "ISSUE_IN_PROGRESS",
  ISSUE_RESOLVED: "ISSUE_RESOLVED",
  ISSUE_UPDATED: "ISSUE_UPDATED",
  ISSUE_DUPLICATE: "ISSUE_DUPLICATE",
  ACCOUNT_APPROVED: "ACCOUNT_APPROVED",
  ACCOUNT_REJECTED: "ACCOUNT_REJECTED",
  SYSTEM_BROADCAST: "SYSTEM_BROADCAST",
} as const;
