"use client";

import { Loader2Icon } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2Icon className="h-12 w-12 text-[#38b6ff] animate-spin mb-4" />
        <p className="text-gray-700 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
