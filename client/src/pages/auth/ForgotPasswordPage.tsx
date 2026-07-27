import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import CampusDeskLogo from "../../assets/images/CampusDesk-logo.png";
import { useForgotPassword } from "../../hooks/useAuth";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { mutate: sendResetLink, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    sendResetLink({ email });
  };

  return (
    <AuthLayout
      heading="Regain access to CampusDesk"
      description="Don't lose track of your maintenance requests. Enter your details to receive a secure reset link and get back to managing your campus reports."
    >
      <div className="mb-8 flex cursor-default items-center gap-3">
        <img src={CampusDeskLogo} alt="Campus Desk Logo" width={40} />
        <span className="text-grey-500 text-xl font-bold">CampusDesk</span>
      </div>

      <h1 className="text-grey-500 mb-2 text-3xl font-semibold">
        Forgot Password?
      </h1>
      <p className="text-grey-400 mb-8 text-sm">
        Enter your email address, and we'll send you a link to reset your
        password.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          required
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending || !email}
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="text-grey-400 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-red-500"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};
