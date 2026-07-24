import { FileQuestion } from "lucide-react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "border-grey-200 flex flex-col items-center justify-center rounded-2xl border border-dashed bg-slate-50 p-12 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <FileQuestion className="text-red-500" size={32} />
      </div>
      <h3 className="text-grey-500 mb-2 text-xl font-semibold">{title}</h3>
      {description && (
        <p className="text-grey-300 mb-6 max-w-sm text-sm">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
