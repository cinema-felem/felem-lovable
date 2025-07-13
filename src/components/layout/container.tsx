import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  as?: keyof JSX.IntrinsicElements;
}

const Container = ({ 
  children, 
  className, 
  size = "lg",
  as: Component = "div"
}: ContainerProps) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full"
  };

  return (
    <Component className={cn(
      "mx-auto px-4",
      sizeClasses[size],
      className
    )}>
      {children}
    </Component>
  );
};

export default Container; 