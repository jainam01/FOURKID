import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BannerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

interface PromotionalBannerProps {
  text: string;
  className?: string;
  icon?: ReactNode;
}

export function Banner({ 
  children, 
  className, 
  variant = "default" 
}: BannerProps) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary text-primary-foreground",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800"
  };
  
  return (
    <div className={cn(
      "px-4 py-3 text-center font-medium",
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
}

export function PromotionalBanner({ 
  text, 
  className, 
  icon 
}: PromotionalBannerProps) {
  return (
    <div className={cn(
      "px-4 py-5 flex items-center justify-center bg-gray-100 text-center",
      className
    )}>
      {icon && <span className="mr-2">{icon}</span>}
      <span className="font-medium text-sm sm:text-base">{text}</span>
    </div>
  );
}

export function ValuePropositionBanner({
  text,
  className,
  icon
}: PromotionalBannerProps) {
  return (
    <div className={cn(
      "px-4 py-6 flex flex-col items-center justify-center bg-white text-center",
      className
    )}>
      {icon && <div className="mb-2 text-primary">{icon}</div>}
      <span className="font-bold text-sm sm:text-base">{text}</span>
    </div>
  );
}
