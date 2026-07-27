import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/Button";
import CampusDeskLogo from "../../assets/images/CampusDesk-logo.png";
import { useLogin } from "../../hooks/useAuth";
import type { LoginUserPayload } from "../../types/auth.types";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const [formData, setFormData] = useState<LoginUserPayload>({
    institutionId: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (fieldErrors[e.target.id]) {
      setFieldErrors({ ...fieldErrors, [e.target.id]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    login(formData, {
      onSuccess: async (data) => {
        // Handle role-based redirection
        const role = data.user.role;
        if (role === "super_admin") {
          navigate("/super-admin/dashboard");
        } else if (role === "staff") {
          navigate("/staff/dashboard");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      },
      onError: (error) => {
        const errorData = error.response?.data;

        if (errorData?.errors) {
          const newErrors: Record<string, string> = {};
          errorData.errors.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          setFieldErrors(newErrors);
        } else {
          setFieldErrors({ general: errorData?.msg || "Invalid credentials" });
        }
      },
    });
  };

  return (
    <AuthLayout
      heading="Welcome back to CampusDesk"
      description="Access your dashboard to check the status of your reported campus issues and stay updated on facility maintenance."
    >
      <div className="mb-8 flex cursor-default items-center gap-3">
        <img src={CampusDeskLogo} alt="Campus Desk Logo" width={40} />
        <span className="text-xl font-bold text-gray-900">CampusDesk</span>
      </div>

      <h1 className="mb-2 text-3xl font-semibold text-gray-900">
        Log in to your account
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-red-500 hover:underline"
        >
          Sign Up
        </Link>
      </p>

      {fieldErrors.general && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
          {fieldErrors.general}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Institution ID"
          id="institutionId"
          value={formData.institutionId}
          onChange={handleChange}
          placeholder="e.g. 10XXXXXX"
          error={fieldErrors.institutionId}
          required
        />

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={fieldErrors.password}
            required
          />

          <div className="flex items-center justify-end pt-1">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-4 w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
};
