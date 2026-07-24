import { AuthLayout } from "../../layouts/AuthLayout";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/Button";
import CampusDeskLogo from "../../assets/images/CampusDesk-logo.png";

export const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <div className="mb-8 flex items-center gap-3 cursor-default">
        <img src={CampusDeskLogo} alt="Campus Desk Logo" width={40} />
        <span className="text-grey-500 text-xl font-bold">CampusDesk</span>
      </div>

      <h1 className="text-grey-500 mb-2 text-3xl font-semibold">
        Set New Password
      </h1>
      <p className="text-grey-400 mb-8 text-sm">
        Your new password must be different from previously used passwords.
      </p>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <PasswordInput
          label="New Password"
          id="newPassword"
          placeholder="Enter new password"
          required
        />

        <PasswordInput
          label="Confirm New Password"
          id="confirmPassword"
          placeholder="Confirm new password"
          required
        />

        <Button type="submit" className="w-full cursor-pointer">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};
