
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SubscribersHeaderProps {
  title: string;
  subtitle: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export function SubscribersHeader({ 
  title, 
  subtitle, 
  onRefresh, 
  isLoading 
}: SubscribersHeaderProps) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onRefresh}
          variant="outline"
          disabled={isLoading}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {subtitle}
        </Button>
      </div>
    </>
  );
}
