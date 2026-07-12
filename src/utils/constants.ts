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
  "google/gemma-4-31b-it:free", // Primary
  "openai/gpt-oss-120b:free", // Fallback 1
  "google/gemma-4-26b-a4b-it:free", // Fallback 2
  "openai/gpt-oss-20b:free", // Fallback 3
] as const;
