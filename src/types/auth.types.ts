import { KNUST_DEPARTMENTS } from "../utils/constants";

export type RegisterStudentType = {
  fullName: string;
  email: string;
  institutionId: string;
  password: string;
};

export type DepartmentType = (typeof KNUST_DEPARTMENTS)[number];

export type RegisterStaffType = RegisterStudentType & {
  department: DepartmentType;
};

export type LoginUserType = { institutionId: string; password: string };

export type ResetPasswordType = {
  resetPasswordToken: string;
  email: string;
  password: string;
};
