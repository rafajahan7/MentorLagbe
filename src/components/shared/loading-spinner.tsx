
import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  text = "Loading...",
  fullScreen = false,
  size = "md",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-screen" : "min-h-[200px] w-full"
      }`}
    >
      <LoaderCircle
        className={`${sizes[size]} animate-spin text-[#183F38] dark:text-[#D9A441]`}
        strokeWidth={2}
      />

      <p className="text-sm font-medium text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
