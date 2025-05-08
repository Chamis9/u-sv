
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
    <div className="text-center py-12 border-2 border-ticket-accent rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
      <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
        {currentLanguage.code === 'lv' ? message.lv : message.en}
      </p>
    </div>
  );
};
