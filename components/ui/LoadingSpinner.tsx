"use client";

import { Loader2Icon } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  text = "Loading...",
  size = "md",
  className = "",
  fullScreen = false,
}: LoadingSpinnerProps) {
  // Map size prop to icon size
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const iconSize = iconSizes[size];

  // Create the container class based on fullScreen prop
  const containerClass = fullScreen
    ? "flex justify-center items-center min-h-screen"
    : "flex justify-center items-center";

  return (
    <div className={`${containerClass} ${className}`}>
      <p className="text-inherit flex flex-row items-center gap-2">
        <span>
          <Loader2Icon className={`${iconSize} animate-spin`} />
        </span>
        {text && <span>{text}</span>}
      </p>
    </div>
  );
}
