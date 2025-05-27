import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12"
}

export function LoadingSpinner({ 
  className, 
  size = "md", 
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("relative", className)}
      {...props}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
          sizeClasses[size]
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export function LoadingSpinnerOverlay({ 
  className,
  size = "lg",
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <LoadingSpinner size={size} />
    </div>
  )
}

export function LoadingSpinnerInline({ 
  className,
  size = "sm",
  ...props 
}: LoadingSpinnerProps) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      {...props}
    >
      <LoadingSpinner size={size} />
    </span>
  )
}