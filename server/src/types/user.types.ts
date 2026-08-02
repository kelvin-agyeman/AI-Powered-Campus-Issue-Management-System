import { Types } from "mongoose";
import { DepartmentType } from "./auth.types";

export type UserRole = "student" | "staff" | "admin";

export type TokenUser = {
  _id: Types.ObjectId;
  fullName: string;
  role: UserRole;
  department?: DepartmentType;
};