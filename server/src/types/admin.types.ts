import { Types } from "mongoose";

type CATEGORIES =
  | "Electricity"
  | "Water Supply"
  | "Roads"
  | "Drainage"
  | "Sanitation"
  | "Security"
  | "Fire"
  | "Buildings"
  | "ICT"
  | "Transport"
  | "Health"
  | "Other";

type PRIORITY_LEVELS = "low" | "medium" | "high" | "critical";

type ASSIGNABLE_DEPARTMENTS =
  | "Environment and Sanitation"
  | "Estate Organisation"
  | "Fire Management"
  | "Health Services"
  | "Information Technology Services"
  | "Municipal Services"
  | "Security Services"
  | "Student Affairs"
  | "Transport Department"
  | "Works and Physical Development";

export type KNUST_DEPARTMENTS =
  | "Academic Affairs"
  | "Accra Office"
  | "Basic Schools"
  | "Development Office"
  | "Environment and Sanitation"
  | "Estate Organisation"
  | "Finance Office"
  | "Fire Management"
  | "Health Services"
  | "Human Resource Development"
  | "Information Technology Services"
  | "Institute of Distance Learning"
  | "Legal Services"
  | "Municipal Services"
  | "Obuasi Campus Administration"
  | "Office of Grants and Research"
  | "Procurement Office"
  | "Quality Assurance and Planning"
  | "School of Graduate Studies"
  | "Security Services"
  | "Student Affairs"
  | "Transport Department"
  | "University Hospital"
  | "University Library"
  | "University Printing Press"
  | "University Relations"
  | "Vice-Chancellor's Office"
  | "Works and Physical Development";

export type FilterIssuesQuery = {
  status?: string;
  assignedDepartment?: string;
  priority?: string;
  category?: string;
  reportedBy?: string;
  assignedStaff?: string;
  aiStatus?: string;
  adminDecision?: string;
  date?: string;
};

export type ModifyIssueType = {
  category: CATEGORIES;
  priority: PRIORITY_LEVELS;
  department: ASSIGNABLE_DEPARTMENTS;
};

export type RejectIssueType = {
  reason: string;
};

export type AssignStaffType = {
  staffId: Types.ObjectId;
};
