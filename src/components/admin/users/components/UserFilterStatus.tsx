
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useLanguage } from "@/features/language";

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: (key: string) => void;
  filterKey: string;
}

function FilterBadge({ label, value, onRemove, filterKey }: FilterBadgeProps) {
  return (
    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
      <span className="font-medium">{label}:</span> {value}
      <button 
        onClick={() => onRemove(filterKey)} 
        className="ml-1 hover:bg-accent rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

interface UserFilterStatusProps {
  activeFilters: Record<string, string>;
  onRemoveFilter: (key: string) => void;
  onClearFilters: () => void;
}

export function UserFilterStatus({ 
  activeFilters, 
  onRemoveFilter,
  onClearFilters
}: UserFilterStatusProps) {
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  const hasActiveFilters = Object.values(activeFilters).some(value => value !== "");
  
  if (!hasActiveFilters) return null;
  
  const filterLabels: Record<string, string> = {
    name: t('Vārds', 'Name'),
    email: t('E-pasts', 'Email'),
    phone: t('Telefons', 'Phone'),
    role: t('Loma', 'Role'),
    status: t('Statuss', 'Status'),
    joinDate: t('Pievienošanās datums', 'Join Date'),
    lastLogin: t('Pēdējā pieslēgšanās', 'Last Login')
  };

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t('Aktīvie filtri:', 'Active filters:')}
      </span>
      
      {Object.entries(activeFilters)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => (
          <FilterBadge 
            key={key} 
            label={filterLabels[key] || key} 
            value={value} 
            onRemove={onRemoveFilter} 
            filterKey={key}
          />
        ))}
        
      <button 
        onClick={onClearFilters}
        className="text-sm text-primary hover:underline ml-2"
      >
        {t('Notīrīt visus filtrus', 'Clear all filters')}
      </button>
    </div>
  );
}
