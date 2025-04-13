
import React from "react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminUsersHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function AdminUsersHeader({ onRefresh, isLoading }: AdminUsersHeaderProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('Administratoru pārvaldība', 'Administrator Management')}
        </h1>
        <p className="text-muted-foreground">
          {t('Pārvaldiet platformas administratorus un to lomas', 'Manage platform administrators and their roles')}
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onRefresh}
          variant="outline"
          disabled={isLoading}
          className="flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {t('Atjaunot datus no datubāzes', 'Refresh Data from Database')}
        </Button>
      </div>
    </div>
  );
}
