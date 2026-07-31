import { Types } from "mongoose";

export type CreateIssueType = {
  description: string;
  location: string;
};

export type IssueImageType = {
  url: string;
  publicId: string;
};

export type UpdateIssueType = {
  description?: string;
  location?: string;
  images?: IssueImageType[];
};

export type IssueServiceCreateInput = CreateIssueType & {
  reportedBy: Types.ObjectId;
  images: IssueImageType[];
};
