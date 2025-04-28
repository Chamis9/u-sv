
import React from 'react';
import { useLanguage } from '@/features/language';

export function LoadingState() {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
