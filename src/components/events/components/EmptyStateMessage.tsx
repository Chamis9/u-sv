
import React from 'react';
import { useLanguage } from "@/features/language";

interface EmptyStateMessageProps {
  message: {
    lv: string;
    en: string;
  };
}

export const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ message }) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-500 dark:text-gray-400">
        {currentLanguage.code === 'lv' ? message.lv : message.en}
      </p>
    </div>
  );
};
