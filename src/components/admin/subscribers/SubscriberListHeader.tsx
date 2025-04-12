
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Download } from "lucide-react";
import { useLanguage } from "@/features/language";

interface SubscriberListHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadCSV: () => void;
}

export function SubscriberListHeader({
  searchTerm,
  onSearchChange,
  onDownloadCSV
}: SubscriberListHeaderProps) {
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('Meklēt e-pasta adreses...', 'Search email addresses...')}
          className="w-full pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onDownloadCSV}>
          <Download className="h-4 w-4 mr-2" />
          {t('Eksportēt CSV', 'Export CSV')}
        </Button>
        
        <Button size="sm">
          <Mail className="h-4 w-4 mr-2" />
          {t('Sūtīt ziņojumu', 'Send Message')}
        </Button>
      </div>
    </div>
  );
}
