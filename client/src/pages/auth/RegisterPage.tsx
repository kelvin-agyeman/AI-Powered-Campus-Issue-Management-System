import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/Button";
import CampusDeskLogo from "../../assets/images/CampusDesk-logo.png";

export const RegisterPage = () => {
  return (
    <AuthLayout 
      heading="Join the CampusDesk Network"
      description="Create your student account today to start reporting maintenance issues directly to the facility management team."
    >
      <div className="mb-8 flex cursor-default items-center gap-3">
        <img src={CampusDeskLogo} alt="Campus Desk Logo" width={40} />
        <span className="text-grey-500 text-xl font-bold">CampusDesk</span>
      </div>

      <h1 className="text-grey-500 mb-2 text-3xl font-semibold">
        Create an account
      </h1>
      <p className="text-grey-400 mb-8 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-red-500 hover:underline"
        >
          Log in
        </Link>
      </p>

      {/* Form Fields corresponding to 4.4.1 */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Full Name"
          id="fullName"
          placeholder="John Doe"
          required
        />

        <Input
          label="Institution ID"
          id="institutionId"
          placeholder="e.g. 10XXXXXX"
          required
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          placeholder="john.doe@gmail.com"
          required
        />

        <PasswordInput
          label="Password"
          id="password"
          placeholder="Create a strong password"
          required
        />

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          placeholder="Confirm your password"
          required
        />

        <Button type="submit" className="mt-6 w-full cursor-pointer">
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
};
