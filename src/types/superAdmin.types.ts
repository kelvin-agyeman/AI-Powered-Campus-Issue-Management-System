type KNUST_DEPARTMENTS =
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

export type CreateAdminType = {
  fullName: string;
  institutionId: string;
  email: string;
  password?: string;
};

export type CreateStaffType = {
  fullName: string;
  email: string;
  institutionId: string;
  department: KNUST_DEPARTMENTS;
  password?: string;
};

export type UpdateUserType = {
  fullName?: string;
  department?: KNUST_DEPARTMENTS;
  role?: "admin" | "staff" | "student";
};

export type FilterUsersQuery = {
  role?: "admin" | "staff" | "student";
  isActive?: string;
  department?: KNUST_DEPARTMENTS;
  search?: string;
};

export type FilterEditRequestsQuery = {
  status?: "pending" | "approved" | "rejected";
};

export type BroadcastAnnouncementType = {
  title: string;
  message: string;
  targetAudience: "all" | "students" | "staff" | "admins";
};
