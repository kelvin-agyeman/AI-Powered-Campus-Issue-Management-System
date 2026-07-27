import User from "../../models/User";
import Issue from "../../models/Issue";
import EditDetailsRequest from "../../models/EditDetailsRequest";
import * as notificationService from "../notification/notificationService";
import { StatusCodes } from "http-status-codes";
import {
  CreateAdminType,
  CreateStaffType,
  UpdateUserType,
  FilterUsersQuery,
  FilterEditRequestsQuery,
  BroadcastAnnouncementType,
} from "../../types/superAdmin.types";

export type ServiceResponse = {
  status: number;
  message?: string;
  data?: any;
};

export const registerAdmin = async (
  adminData: CreateAdminType,
): Promise<ServiceResponse> => {
  const { fullName, email, institutionId, password } = adminData;
  const existingUser = await User.findOne({
    institutionId: adminData.institutionId,
  });

  if (existingUser) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "User with this Admin ID already exists.",
    };
  }

  const admin = await User.create({
    fullName,
    institutionId,
    email,
    password,
    role: "admin",
    emailVerified: true,
    verifiedAt: new Date(),
  });

  // Trigger admin creation notification and email
  await notificationService.notifyAdminUserCreated(admin);

  return {
    status: StatusCodes.CREATED,
    message: "Admin created successfully.",
    data: { user: admin },
  };
};

export const registerStaff = async (
  staffData: CreateStaffType,
): Promise<ServiceResponse> => {
  const { fullName, institutionId, email, department, password } = staffData;
  const existingUser = await User.findOne({
    institutionId: staffData.institutionId,
  });

  if (existingUser) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "User with this Staff ID already exists.",
    };
  }

  const staff = await User.create({
    fullName,
    institutionId,
    email,
    department,
    password,
    role: "staff",
    emailVerified: true,
    verifiedAt: new Date(),
  });

  // Trigger staff creation notification and email
  await notificationService.notifyStaffUserCreated(staff);

  return {
    status: StatusCodes.CREATED,
    message: "Staff created successfully.",
    data: { user: staff },
  };
};

export const getAllUsers = async (
  filters: FilterUsersQuery,
): Promise<ServiceResponse> => {
  const query: any = {};

  if (filters.role) query.role = filters.role;
  if (filters.isActive) query.isActive = filters.isActive === "true";
  if (filters.department) query.department = filters.department;

  if (filters.search) {
    query.$or = [
      { fullName: { $regex: filters.search, $options: "i" } },
      { institutionId: { $regex: filters.search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 });

  return {
    status: StatusCodes.OK,
    data: { users },
  };
};

export const getUserById = async (userId: string): Promise<ServiceResponse> => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: "User not found",
    };
  }

  return {
    status: StatusCodes.OK,
    data: { user },
  };
};

export const updateUser = async (
  userId: string,
  updateData: UpdateUserType,
): Promise<ServiceResponse> => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: "after",
    runValidators: true,
  }).select("-password");

  if (!user) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: "User not found",
    };
  }

  return {
    status: StatusCodes.OK,
    message: "User updated successfully.",
    data: { user },
  };
};

export const toggleUserActiveStatus = async (
  userId: string,
  isActive: boolean,
): Promise<ServiceResponse> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { returnDocument: "after" },
  ).select("-password");

  if (!user) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: "User not found",
    };
  }

  return {
    status: StatusCodes.OK,
    message: isActive
      ? "User account reactivated."
      : "User account deactivated.",
    data: { user },
  };
};

export const getEditRequests = async (
  filters: FilterEditRequestsQuery,
): Promise<ServiceResponse> => {
  const query: any = {};
  if (filters.status) query.status = filters.status;

  const requests = await EditDetailsRequest.find(query)
    .populate("requestedBy", "fullName email institutionId")
    .sort({ createdAt: -1 });

  return {
    status: StatusCodes.OK,
    data: { requests },
  };
};

export const approveEditRequest = async (
  requestId: string,
): Promise<ServiceResponse> => {
  // Populate requestedBy so we can access the user's email and name for notifications
  const request =
    await EditDetailsRequest.findById(requestId).populate("requestedBy");

  if (!request || request.status !== "pending") {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "Request not found or already processed.",
    };
  }

  if (!request.newInstitutionId) {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "New Institution ID is required",
    };
  }

  await User.findByIdAndUpdate(request.requestedBy._id, {
    institutionId: request.newInstitutionId,
  });

  request.status = "approved";
  await request.save();

  // Notify the user of the approval
  await notificationService.notifyEditRequestApproved(
    request.requestedBy,
    request.newInstitutionId,
  );

  return {
    status: StatusCodes.OK,
    message: "Edit request approved successfully. User ID updated.",
    data: { request },
  };
};

export const rejectEditRequest = async (
  requestId: string,
  reason: string,
): Promise<ServiceResponse> => {
  // Populate requestedBy so we can access the user's email and name for notifications
  const request =
    await EditDetailsRequest.findById(requestId).populate("requestedBy");

  if (!request || request.status !== "pending") {
    return {
      status: StatusCodes.BAD_REQUEST,
      message: "Request not found or already processed.",
    };
  }

  request.status = "rejected";
  request.reason = reason;
  await request.save();

  // Notify the user of the rejection
  await notificationService.notifyEditRequestRejected(
    request.requestedBy,
    request.reason,
  );

  return {
    status: StatusCodes.OK,
    message: "Edit request rejected.",
    data: { request },
  };
};

export const getDashboardAnalytics = async (): Promise<ServiceResponse> => {
  const [
    totalStudents,
    totalStaff,
    totalAdmins,
    openIssues,
    resolvedIssues,
    pendingEditRequests,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "staff" }),
    User.countDocuments({ role: "admin" }),
    Issue.countDocuments({ isResolved: false, isDeleted: false }),
    Issue.countDocuments({ isResolved: true, isDeleted: false }),
    EditDetailsRequest.countDocuments({ status: "pending" }),
  ]);

  const analytics = {
    users: {
      students: totalStudents,
      staff: totalStaff,
      admins: totalAdmins,
      total: totalStudents + totalStaff + totalAdmins,
    },
    issues: {
      open: openIssues,
      resolved: resolvedIssues,
      total: openIssues + resolvedIssues,
    },
    requests: {
      pendingEdits: pendingEditRequests,
    },
  };

  return {
    status: StatusCodes.OK,
    data: { analytics },
  };
};

export const sendBroadcast = async (
  broadcastData: BroadcastAnnouncementType,
): Promise<ServiceResponse> => {
  await notificationService.sendSystemBroadcast(broadcastData);

  return {
    status: StatusCodes.OK,
    message: "Broadcast announcement sent successfully.",
    data: { broadcast: { delivered: true, ...broadcastData } },
  };
};
