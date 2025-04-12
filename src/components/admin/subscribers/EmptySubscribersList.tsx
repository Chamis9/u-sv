
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface EmptySubscribersListProps {
  message: string;
  buttonLabel: string;
  onRefresh: () => void;
}

export function EmptySubscribersList({ 
  message, 
  buttonLabel, 
  onRefresh 
}: EmptySubscribersListProps) {
  return (
    <div className="flex justify-center items-center h-64 text-center">
      <div>
        <p className="text-muted-foreground">
          {message}
        </p>
        <Button className="mt-4" variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
