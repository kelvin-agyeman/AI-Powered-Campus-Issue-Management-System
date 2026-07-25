import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Button } from "../../components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export const EmailVerificationPage = () => {
  return (
    <AuthLayout
      heading="Secure your CampusDesk account"
      description="Verifying your email ensures that all status updates regarding your reported facility issues and maintenance requests are delivered safely to your inbox."
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>

        <h1 className="text-grey-500 mb-2 text-3xl font-semibold">
          Email Verified!
        </h1>
        <p className="text-grey-400 mb-8 text-sm">
          Your email address has been successfully verified. You can now access
          your dashboard and report campus issues.
        </p>

        <Link to="/login" className="w-full">
          <Button className="w-full cursor-pointer">Proceed to Login</Button>
        </Link>
      </div>
    </AuthLayout>
  );
};
