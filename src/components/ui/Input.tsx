import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "glass" | "outline" | "filled";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = "default",
      type = "text",
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        "bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500",
      glass:
        "glass border border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400",
      outline:
        "bg-transparent border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500",
      filled:
        "bg-gray-100 border-0 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
            "placeholder:text-gray-500",
            variants[variant],
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
