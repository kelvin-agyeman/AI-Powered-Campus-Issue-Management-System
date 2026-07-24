import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/cn";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-grey-400 text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            type={showPassword ? "text" : "password"}
            ref={ref}
            className={cn(
              "border-grey-200 text-grey-500 placeholder:text-grey-200 disabled:bg-grey-100 flex h-12 w-full rounded-xl border bg-white px-4 py-2 pr-12 text-base focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:cursor-not-allowed",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-grey-300 hover:text-grey-500 absolute top-1/2 right-4 -translate-y-1/2 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
