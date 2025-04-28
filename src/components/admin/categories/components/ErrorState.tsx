
import React from 'react';
import { useLanguage } from '@/features/language';

interface ErrorStateProps {
  error: Error;
}

export function ErrorState({ error }: ErrorStateProps) {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="text-center py-8 border rounded-md">
      <p className="text-destructive">{t('Kļūda ielādējot kategorijas', 'Error loading categories')}</p>
      <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
    </div>
  );
}
