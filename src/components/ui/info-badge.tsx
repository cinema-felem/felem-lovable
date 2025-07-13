import { LucideIcon } from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface InfoBadgeProps {
  icon?: LucideIcon;
  label: string;
  value?: string | number;
  variant?: "default" | "outline" | "secondary";
  className?: string;
  iconClassName?: string;
}

const InfoBadge = ({ 
  icon: Icon, 
  label, 
  value, 
  variant = "default",
  className,
  iconClassName 
}: InfoBadgeProps) => {
  return (
    <Badge 
      variant={variant} 
      className={cn(
        "bg-cinema-dark-gray/50 text-white border-cinema-dark-gray/70",
        className
      )}
    >
      {Icon && (
        <Icon className={cn("w-3 h-3 mr-1", iconClassName)} />
      )}
      <span className="font-medium">{label}</span>
      {value && (
        <span className="ml-1 opacity-90">{value}</span>
      )}
    </Badge>
  );
};

export default InfoBadge; 