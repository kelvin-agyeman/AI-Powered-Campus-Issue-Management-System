import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { EmailVerificationPage } from "./pages/auth/EmailVerificationPage";

// Student Pages & Layout
import { StudentLayout } from "./layouts/StudentLayout";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { MyReportsPage } from "./pages/student/MyReportsPage";
import { NewReportPage } from "./pages/student/NewReportPage";
import { StudentProfilePage } from "./pages/student/StudentProfilePage";
import { StudentNotificationsPage } from "./pages/student/StudentNotificationsPage";

// Admin Pages & Layout
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { PendingReviews } from "./pages/admin/PendingReviews";
import { AdminProfilePage } from "./pages/admin/AdminProfilePage";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage";
import { AllIssuesPage } from "./pages/admin/AllIssues";
import { IssueReviewDetail } from "./pages/admin/IssueReviewDetail";

// Staff Pages & Layout
import { StaffLayout } from "./layouts/StaffLayout";
import { StaffDashboard } from "./pages/staff/StaffDashboard";
import { StaffProfilePage } from "./pages/staff/StaffProfilePage";
import { StaffNotificationsPage } from "./pages/staff/StaffNotificationsPage";
import { StaffIssueDetail } from "./pages/staff/StaffIssueDetail";
import { StaffResolvedIssues } from "./pages/staff/StaffResolvedIssues";

// Super Admin Pages & Layout
import { SuperAdminLayout } from "./layouts/SuperAdminLayout";
import { SuperAdminDashboard } from "./pages/super-admin/SuperAdminDashboard";

// Global Components
import { ErrorComponent } from "./components/ui/ErrorComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorComponent />,
  },

  // Auth Routes
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/verify-email",
    element: <EmailVerificationPage />,
  },

  // Student Routes
  {
    path: "/student",
    element: <StudentLayout />,
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        element: <Navigate to="/student/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "reports",
        element: <MyReportsPage />,
      },
      {
        path: "new-report",
        element: <NewReportPage />,
      },
      {
        path: "profile",
        element: <StudentProfilePage />,
      },
      {
        path: "notifications",
        element: <StudentNotificationsPage />,
      },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "pending",
        element: <PendingReviews />,
      },
      {
        path: "pending/:id",
        element: <IssueReviewDetail />,
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
      {
        path: "notifications",
        element: <AdminNotificationsPage />,
      },
      {
        path: "issues",
        element: <AllIssuesPage />,
      },
    ],
  },

  // Staff Routes
  {
    path: "/staff",
    element: <StaffLayout />,
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        element: <Navigate to="/staff/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <StaffDashboard />,
      },
      {
        path: "task/:id",
        element: <StaffIssueDetail />,
      },
      {
        path: "resolved",
        element: <StaffResolvedIssues />,
      },
      {
        path: "profile",
        element: <StaffProfilePage />,
      },
      {
        path: "notifications",
        element: <StaffNotificationsPage />,
      },
    ],
  },

  // Super Admin Routes
  {
    path: "/super-admin",
    element: <SuperAdminLayout />,
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        element: <Navigate to="/super-admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <SuperAdminDashboard />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
