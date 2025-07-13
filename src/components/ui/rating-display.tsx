import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  showDecimal?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  starClassName?: string;
  textClassName?: string;
}

const RatingDisplay = ({ 
  rating, 
  maxRating = 10,
  showDecimal = true,
  size = "md",
  className,
  starClassName,
  textClassName 
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: {
      star: "w-3 h-3",
      text: "text-xs"
    },
    md: {
      star: "w-4 h-4", 
      text: "text-sm"
    },
    lg: {
      star: "w-5 h-5",
      text: "text-base"
    }
  };

  const displayRating = showDecimal ? rating.toFixed(1) : Math.round(rating).toString();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className={cn(
        "text-cinema-gold fill-cinema-gold",
        sizeClasses[size].star,
        starClassName
      )} />
      <span className={cn(
        "text-white font-medium",
        sizeClasses[size].text,
        textClassName
      )}>
        {displayRating}
        {maxRating !== 10 && <span className="opacity-70">/{maxRating}</span>}
      </span>
    </div>
  );
};

export default RatingDisplay; 