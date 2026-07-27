import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "../../layouts/AuthLayout";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/Button";
import CampusDeskLogo from "../../assets/images/CampusDesk-logo.png";
import { useResetPassword } from "../../hooks/useAuth";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    resetPassword({
      password,
      email,
      resetPasswordToken: token,
    });
  };

  // If a user navigates directly to this page without a token/email
  if (!token || !email) {
    return (
      <AuthLayout
        heading="Invalid Link"
        description="This password reset link is invalid or has expired."
      >
        <div className="text-center">
          <p className="text-grey-500 mb-6 text-lg font-medium">
            Please request a new password reset link.
          </p>
          <Link to="/forgot-password">
            <Button className="w-full">Go to Forgot Password</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="Update your security credentials"
      description="Create a strong, new password to keep your account secure so you can continue reporting and tracking campus facility issues without interruption."
    >
      <div className="mb-8 flex cursor-default items-center gap-3">
        <img src={CampusDeskLogo} alt="Campus Desk Logo" width={40} />
        <span className="text-grey-500 text-xl font-bold">CampusDesk</span>
      </div>

      <h1 className="text-grey-500 mb-2 text-3xl font-semibold">
        Set New Password
      </h1>
      <p className="text-grey-400 mb-8 text-sm">
        Your new password must be different from previously used passwords.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <PasswordInput
          label="New Password"
          id="newPassword"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          required
        />

        <PasswordInput
          label="Confirm New Password"
          id="confirmPassword"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isPending}
          required
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending || !password || !confirmPassword}
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
};
