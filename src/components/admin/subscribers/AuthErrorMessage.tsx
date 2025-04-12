
import React from "react";
import { AlertCircle } from "lucide-react";

interface AuthErrorMessageProps {
  message: string;
}

export function AuthErrorMessage({ message }: AuthErrorMessageProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">{message}</h3>
      </div>
      <p className="mt-2 text-sm">
        {message}
      </p>
    </div>
  );
}
