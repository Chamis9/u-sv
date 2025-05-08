
import React from 'react';
import { useLanguage } from "@/features/language";
import { Ticket } from "lucide-react";

interface EmptyStateMessageProps {
  message: {
    lv: string;
    en: string;
  };
}

export const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ message }) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="text-center py-12 bg-ticket-bg/30 border border-ticket-text/10 rounded-lg backdrop-blur-sm">
      <Ticket className="h-12 w-12 text-ticket-accent mx-auto mb-4 opacity-70" />
      <p className="text-lg font-medium text-ticket-text">
        {currentLanguage.code === 'lv' ? message.lv : message.en}
      </p>
    </div>
  );
};
