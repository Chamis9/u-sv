
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/features/language';

interface CategoriesHeaderProps {
  onAddClick: () => void;
}

export function CategoriesHeader({ onAddClick }: CategoriesHeaderProps) {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">
        {t('Kategoriju pārvaldība', 'Category Management')}
      </h2>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        {t('Pievienot kategoriju', 'Add Category')}
      </Button>
    </div>
  );
}
