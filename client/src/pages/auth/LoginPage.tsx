import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/Button";
import CampusDeskLogo from "../../assets/images/CampusDesk-logo.png";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="mb-8 flex items-center gap-3 cursor-default">
        <img src={CampusDeskLogo} alt="Campus Desk Logo" width={40} />
        <span className="text-grey-500 text-xl font-bold">CampusDesk</span>
      </div>

      <h1 className="text-grey-500 mb-2 text-3xl font-semibold">
        Log in to your account
      </h1>
      <p className="text-grey-400 mb-8 text-sm">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-red-500 hover:underline"
        >
          Sign Up
        </Link>
      </p>

      {/* Form Fields corresponding to 4.4.2 */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Institution ID"
          id="institutionId"
          placeholder="e.g. 10XXXXXX"
          required
        />

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            id="password"
            placeholder="Enter your password"
            required
          />

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between pt-1">
            <label className="text-grey-400 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="border-grey-200 h-4 w-4 rounded text-red-500 focus:ring-red-500 focus:ring-offset-1"
              />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="mt-4 w-full cursor-pointer">
          Login
        </Button>
      </form>
    </AuthLayout>
  );
};
