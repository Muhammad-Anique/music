// components/dashboard/isLoadingFalseforDashboard.tsx
"use client";

import { useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";

const IsLoadingFalseforDashboard = () => {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return null; // We don't need to render anything
};

export default IsLoadingFalseforDashboard;
