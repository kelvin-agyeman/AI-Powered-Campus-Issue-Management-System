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

// Global Components
import { ErrorComponent } from "./components/ui/ErrorComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorComponent />,
  },
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

  // New Student Routes
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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
