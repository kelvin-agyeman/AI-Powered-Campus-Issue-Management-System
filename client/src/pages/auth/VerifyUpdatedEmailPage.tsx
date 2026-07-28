import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useVerifyUpdatedEmail, useCurrentUser } from "../../hooks/useUser";

export const VerifyUpdatedEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Fetch current user status (if logged in on this device)
  const { data: currentUserData } = useCurrentUser();
  const isLoggedIn = !!currentUserData?.user;

  // Dynamic route and text fallbacks
  const targetRoute = isLoggedIn
    ? `/${currentUserData.user.role}/dashboard`
    : `/login`;
  const successButtonText = isLoggedIn
    ? "Back to Dashboard"
    : "Proceed to Login";
  const errorButtonText = isLoggedIn ? "Back to Dashboard" : "Back to Login";

  const { mutate: verify, isPending } = useVerifyUpdatedEmail();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const hasAttemptedRef = useRef(false);
  const invalidLink = !token || !email;

  useEffect(() => {
    if (invalidLink || hasAttemptedRef.current) return;

    hasAttemptedRef.current = true;

    verify(
      {
        newEmail: email!,
        newVerificationToken: token!,
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
      heading="Update Your Email"
      description="Verifying this address ensures we have the correct contact information for your CampusDesk account."
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
              Please wait while we confirm your new email address.
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
              Email Updated!
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              Your email address has been successfully verified and updated.
            </p>
            <Link to={targetRoute} className="w-full">
              <Button className="w-full cursor-pointer">
                {successButtonText}
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
              Update Failed
            </h1>
            <p className="mb-8 text-sm text-red-500">{errorMessage}</p>
            <div className="flex w-full flex-col gap-3">
              <Link to={targetRoute} className="w-full">
                <Button variant="outline" className="w-full cursor-pointer">
                  {errorButtonText}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
