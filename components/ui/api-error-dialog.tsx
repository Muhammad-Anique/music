'use client';

import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ApiErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: { title: string; description: string };
  onUpgrade: () => void;
  onSettings: () => void;
}

export function ApiErrorDialog({ 
  open, 
  onOpenChange,
  errorMessage,
  onUpgrade,
  onSettings
}: ApiErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "bg-white/95 backdrop-blur-xl",
        "border-2 border-red-200/40",
        "p-0 gap-0 pb-8"
      )}>
        <AlertDialogHeader>
          <div className={cn(
            "flex flex-col items-center gap-4 p-6",
            "text-red-500 text-center"
          )}>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <AlertDialogTitle className="text-red-600 text-lg">
                {errorMessage.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {errorMessage.description}
              </AlertDialogDescription>
            </div>

            <div className="w-full h-px bg-red-100" />
            
            <div className="text-sm text-red-400 mb-2">
              Unlock premium features and advanced AI capabilities
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Button
                onClick={onUpgrade}
                className={cn(
                  "w-full",
                  "bg-gradient-to-r from-amber-500 to-orange-500",
                  "text-white",
                  "border border-amber-400",
                  "h-8",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:shadow-md",
                  "hover:from-amber-600 hover:to-orange-600"
                )}
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Upgrade to Pro
              </Button>
              
              <Button
                variant="outline"
                onClick={onSettings}
                className={cn(
                  "w-full",
                  "text-xs text-gray-500 hover:text-gray-600",
                  "hover:bg-gray-50/50",
                  "border border-gray-200",
                  "h-8",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:shadow-sm"
                )}
              >
                Set API Keys
              </Button>
            </div>

            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className={cn(
                  " text-xs text-gray-700 hover:text-gray-900",
                  "h-7 px-2",
                  "hover:bg-gray-50/50",
                  "transition-colors duration-200 border border-gray-500 bg-gray-200" 
                )}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
} 