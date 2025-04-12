
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface FetchErrorMessageProps {
  error: string;
  errorTitle: string;
  retryLabel: string;
  onRetry: () => void;
}

export function FetchErrorMessage({ 
  error, 
  errorTitle, 
  retryLabel, 
  onRetry 
}: FetchErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 dark:bg-red-900/20 dark:text-red-200">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">{errorTitle}</h3>
      </div>
      <p className="mt-2 text-sm">{error}</p>
      <div className="mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {retryLabel}
        </Button>
      </div>
    </div>
  );
}
