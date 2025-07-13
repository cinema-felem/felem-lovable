import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ 
  size = "md", 
  className,
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-cinema-dark-gray border-t-cinema-gold",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-gray-400 mt-2 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 