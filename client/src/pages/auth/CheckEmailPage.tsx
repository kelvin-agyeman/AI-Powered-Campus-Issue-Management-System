import { useLocation, Link, Navigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Button } from "../../components/ui/Button";
import { Mail, ArrowLeft } from "lucide-react";
import { useResendVerificationEmail } from "../../hooks/useAuth";

export const CheckEmailPage = () => {
  const location = useLocation();
  const { mutate: resendEmail, isPending } = useResendVerificationEmail();
  
  // Extract the email passed from the RegisterPage
  const email = location.state?.email;

  // If someone navigates here directly without an email in state, redirect to register
  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const handleResend = () => {
    resendEmail({ email });
  };

  return (
    <AuthLayout
      heading="Check your inbox"
      description="We need to verify your email address before you can access the CampusDesk dashboard."
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Mail size={40} className="text-red-500" />
        </div>

        <h1 className="mb-2 text-3xl font-semibold text-gray-900">
          Verify your email
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          We've sent a verification link to <span className="font-medium text-gray-900">{email}</span>. 
          Please check your inbox and click the link to activate your account.
        </p>

        <Button 
          onClick={handleResend} 
          disabled={isPending} 
          variant="outline" 
          className="w-full mb-6 cursor-pointer"
        >
          {isPending ? "Sending..." : "Resend Verification Email"}
        </Button>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};