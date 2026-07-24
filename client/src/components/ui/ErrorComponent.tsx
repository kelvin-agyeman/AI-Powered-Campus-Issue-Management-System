import { cn } from "../../lib/cn";

interface ErrorComponentProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void; // Can be a function or a navigation hook later
  className?: string;
}

export const ErrorComponent = ({
  title = "Oh! Page Not Found!",
  message = "We can't seem to find the page you are looking for.",
  actionText = "Back Home",
  onAction,
  className,
}: ErrorComponentProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[70vh] w-full flex-col items-center justify-center bg-slate-50 p-6 text-center",
        className,
      )}
    >
      {/* Illustration Placeholder - Replace with your actual SVG/PNG from assets */}
      <div className="bg-grey-100 relative mb-8 flex h-64 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl">
        <span className="text-grey-400 text-sm font-medium">
          404 Illustration Placeholder
        </span>
        {/* Example of how to add the image later: */}
        {/* <img src={ErrorImage} alt="Error" className="h-full w-full object-contain" /> */}
      </div>

      <h1 className="text-grey-500 mb-3 text-3xl font-semibold md:text-4xl">
        {title}
      </h1>
      <p className="text-grey-300 mb-8 text-base md:text-lg">{message}</p>

      <button
        onClick={onAction}
        className="font-medium text-red-500 underline decoration-transparent transition-all hover:decoration-red-500 focus:outline-none"
      >
        {actionText}
      </button>
    </div>
  );
};
