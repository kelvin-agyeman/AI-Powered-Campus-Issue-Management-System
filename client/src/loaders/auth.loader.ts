import { redirect } from "react-router-dom";
import { getCurrentUser } from "../services/auth.service";
import axios from "axios";

export const layoutLoader = (allowedRoles: string[]) => async () => {
  try {
    const currentUser = await getCurrentUser();

    const user = currentUser.user;

    // If the user is logged in but doesn't have the correct role for this route
    if (!allowedRoles.includes(user.role)) {
      const dashboardRoutes: Record<string, string> = {
        student: "/student/dashboard",
        staff: "/staff/dashboard",
        admin: "/admin/dashboard",
        super_admin: "/super-admin/dashboard",
      };

      throw redirect(dashboardRoutes[user.role] || "/login");
    }

    return { user };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/login");
    }

    throw error;
  }
};
