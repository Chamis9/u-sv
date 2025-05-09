
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader, Search } from "lucide-react";
import { useLanguage } from "@/features/language";

interface EmptyOrErrorStateProps {
  isLoading?: boolean;
  error?: string;
  searchTerm?: string;
  onRetry?: () => void;
  title?: string;       // Added missing property
  description?: string; // Added missing property
  icon?: string;        // Added missing property
}

export function EmptyOrErrorState({ 
  isLoading, 
  error, 
  searchTerm, 
  onRetry,
  title,
  description,
  icon
}: EmptyOrErrorStateProps) {
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">{t('Ielādē...', 'Loading...')}</p>
        </div>
      </div>
    );
  }
  
  if (error || title) {
    return (
      <div className="flex justify-center items-center h-64 text-center">
        <div>
          {icon === 'alert-triangle' ? (
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          ) : (
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          )}
          <p className="font-medium text-lg">{title || ''}</p>
          <p className="text-muted-foreground">{error || description || ''}</p>
          {onRetry && (
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={onRetry}
            >
              {t('Mēģināt vēlreiz', 'Try Again')}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  if (searchTerm) {
    return (
      <div className="flex justify-center items-center h-64 text-center">
        <div>
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            {t('Nav atrasts neviens abonents, kas atbilst meklēšanas kritērijiem.', 
              'No subscribers found matching your search criteria.')}
          </p>
        </div>
      </div>
    );
  }
  
  return null;
}
