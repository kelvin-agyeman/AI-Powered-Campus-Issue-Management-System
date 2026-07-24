import { cn } from "../../lib/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode; // For placing a "Report Issue" button on the right
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  action,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "border-grey-100 mb-8 flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-center",
        className,
      )}
    >
      <div>
        <h1 className="text-grey-500 text-2xl font-bold md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-grey-300 mt-1 text-sm">{description}</p>
        )}
      </div>
      {action && <div className="w-full md:w-auto">{action}</div>}
    </div>
  );
};
