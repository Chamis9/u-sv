
import React from 'react';
import { useLanguage } from '@/features/language';

export function EmptyState() {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="text-center py-8 border rounded-md">
      <p className="text-gray-500">{t('Nav nevienas kategorijas', 'No categories found')}</p>
    </div>
  );
}
