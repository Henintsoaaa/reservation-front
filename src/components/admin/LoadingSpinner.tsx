"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  className = "",
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-16 w-16",
    large: "h-32 w-32",
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
