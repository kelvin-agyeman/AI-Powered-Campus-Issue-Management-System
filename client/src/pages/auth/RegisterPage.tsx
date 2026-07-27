import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/Button";
import CampusDeskLogo from "../../assets/images/CampusDesk-logo.png";
import { useRegister } from "../../hooks/useAuth";
import type { RegisterStudentPayload } from "../../types/auth.types";
import { toast } from "sonner";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const [formData, setFormData] = useState<RegisterStudentPayload>({
    fullName: "",
    institutionId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error when user starts typing
    if (fieldErrors[e.target.id]) {
      setFieldErrors({ ...fieldErrors, [e.target.id]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    register(formData, {
      onSuccess: () => {
        // Display Sonner toast to notify the user to check their email
        toast.success("Account created successfully!", {
          description:
            "A verification link has been sent to your email. Please check your inbox to verify your account.",
          duration: 6000,
        });

        toast.success("Account created successfully!");
        navigate("/check-email", { state: { email: formData.email } });

        // Clear the form fields upon successful registration
        setFormData({
          fullName: "",
          institutionId: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      },
      onError: (error) => {
        const errorData = error.response?.data;

        // Handle Zod array errors
        if (errorData?.errors) {
          const newErrors: Record<string, string> = {};
          errorData.errors.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          setFieldErrors(newErrors);
        } else {
          // Handle general backend errors (e.g., "Student already exists")
          setFieldErrors({
            general:
              errorData?.msg ?? errorData?.message ?? "Registration failed",
          });
        }
      },
    });
  };

  return (
    <AuthLayout
      heading="Join the CampusDesk Network"
      description="Create your student account today to start reporting maintenance issues directly to the facility management team."
    >
      <div className="mb-8 flex cursor-default items-center gap-3">
        <img src={CampusDeskLogo} alt="Campus Desk Logo" width={40} />
        <span className="text-xl font-bold text-gray-900">CampusDesk</span>
      </div>

      <h1 className="mb-2 text-3xl font-semibold text-gray-900">
        Create an account
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-red-500 hover:underline"
        >
          Log in
        </Link>
      </p>

      {fieldErrors.general && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
          {fieldErrors.general}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          id="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          error={fieldErrors.fullName}
          required
        />

        <Input
          label="Institution ID"
          id="institutionId"
          value={formData.institutionId}
          onChange={handleChange}
          placeholder="e.g. 10XXXXXX"
          error={fieldErrors.institutionId}
          required
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@gmail.com"
          error={fieldErrors.email}
          required
        />

        <PasswordInput
          label="Password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          error={fieldErrors.password}
          required
        />

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={fieldErrors.confirmPassword}
          required
        />

        <Button
          type="submit"
          className="mt-6 w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
};
