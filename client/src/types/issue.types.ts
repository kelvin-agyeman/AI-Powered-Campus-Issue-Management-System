export interface IssueImage {
  url: string;
  publicId: string;
}

export interface AiRecommendation {
  category?: string;
  department?: string;
  priority?: string;
  confidenceScore?: number;
  title?: string;
  summary?: string;
  reasoning?: string;
  requiresHumanReview?: boolean;
}

export interface ResolutionSupport {
  recommendedAction?: string;
  requiredResources?: string[];
  estimatedResolutionTime?: string;
  safetyNotes?: string[];
}

export interface ProgressUpdate {
  _id?: string;
  note: string;
  status?: IssueStatus;
  updatedBy: string | PopulatedUser;
  createdAt: string;
}

export interface DuplicateAnalysis {
  isDuplicate: boolean;
  duplicateScore: number;
  reasoning?: string;
  possibleDuplicateOf?: string | null;
}

export type AiStatus = "pending" | "processing" | "completed" | "failed";

export type IssueStatus =
  | "pending_admin_review"
  | "in_progress"
  | "assigned"
  | "resolved"
  | "approved"
  | "rejected";

export type AdminDecision = "approved" | "modified" | "rejected";

export interface PopulatedUser {
  _id: string;
  fullName: string;
  email: string;
  institutionId: string;
  avatar?: string;
}

export interface Issue {
  _id: string;
  description: string;
  location: string;
  images: IssueImage[];
  reportedBy: string | PopulatedUser;
  aiModel?: string;
  aiRecommendation?: AiRecommendation;
  resolutionSupport?: ResolutionSupport;
  aiStatus: AiStatus;
  status: IssueStatus;
  assignedDepartment?: string;
  assignedStaff?: string;
  assignedBy?: string;
  assignedAt?: string;
  acceptedAt?: string;
  progressUpdates?: ProgressUpdate[];
  reviewedBy?: string;
  reviewedAt?: string;
  adminDecision?: AdminDecision;
  priority?: string;
  category?: string;
  resolutionNotes?: string;
  resolutionImages?: IssueImage[];
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  rejectionReason?: string;
  duplicateAnalysis?: DuplicateAnalysis;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
