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
