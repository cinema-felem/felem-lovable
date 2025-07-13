import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const PageHeader = ({ 
  title, 
  subtitle, 
  children, 
  className,
  titleClassName,
  subtitleClassName 
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl md:text-4xl font-bold text-white", titleClassName)}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn("text-gray-400 mt-2", subtitleClassName)}>
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 