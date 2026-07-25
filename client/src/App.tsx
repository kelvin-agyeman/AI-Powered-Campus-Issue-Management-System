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
import { StudentSettingsPage } from "./pages/student/StudentSettingsPage";
import { StudentNotificationsPage } from "./pages/student/StudentNotificationsPage";

// Admin Pages & Layout
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { PendingIssues } from "./pages/admin/PendingIssues";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage";

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
        path: "settings",
        element: <StudentSettingsPage />,
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
        element: <PendingIssues />,
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
      {
        path: "notifications",
        element: <AdminNotificationsPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
