import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useVerifyEmail } from "../../hooks/useAuth";

export const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { mutate: verify, isPending } = useVerifyEmail();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Use a ref to prevent strict-mode double-firing of the verification request
  const hasAttemptedRef = useRef(false);
  const invalidLink = !token || !email;

  useEffect(() => {
    if (invalidLink || hasAttemptedRef.current) return;

    hasAttemptedRef.current = true;

    verify(
      {
        email: email!,
        verificationToken: token!,
      },
      {
        onSuccess: () => {
          setStatus("success");
        },
        onError: (error) => {
          setStatus("error");
          setErrorMessage(
            error.response?.data?.message ??
              error.response?.data?.msg ??
              "Verification failed. Your link may have expired.",
          );
        },
      },
    );
  }, [invalidLink, token, email, verify]);

  return (
    <AuthLayout
      heading="Secure your CampusDesk account"
      description="Verifying your email ensures that all status updates regarding your reported facility issues and maintenance requests are delivered safely to your inbox."
    >
      <div className="flex flex-col items-center text-center">
        {/* LOADING STATE */}
        {(isPending || status === "idle") && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Loader2 size={40} className="animate-spin text-gray-500" />
            </div>
            <h1 className="mb-2 text-3xl font-semibold text-gray-900">
              Verifying...
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-semibold text-gray-900">
              Email Verified!
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              Your email address has been successfully verified. You can now
              access your dashboard and report campus issues.
            </p>
            <Link to="/login" className="w-full">
              <Button className="w-full cursor-pointer">
                Proceed to Login
              </Button>
            </Link>
          </>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="mb-2 text-3xl font-semibold text-gray-900">
              Verification Failed
            </h1>
            <p className="mb-8 text-sm text-red-500">{errorMessage}</p>
            <div className="flex w-full flex-col gap-3">
              {/* If they failed, send them to the prompt page to request a new one */}
              <Link to="/check-email" state={{ email }} className="w-full">
                <Button className="w-full cursor-pointer">
                  Request New Link
                </Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full cursor-pointer">
                  Back to Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
