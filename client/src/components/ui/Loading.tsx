import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

interface LoadingProps {
  className?: string;
  size?: number;
  text?: string;
}

export const Loading = ({ className, size = 40, text }: LoadingProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center p-8",
        className,
      )}
    >
      <Loader2 size={size} className="animate-spin text-red-500" />
      {text && <p className="text-grey-400 mt-4 text-sm font-medium">{text}</p>}
    </div>
  );
};
