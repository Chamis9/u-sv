
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";

interface FormActionsProps {
  onClose: () => void;
  isEditing: boolean;
  submitting: boolean;
}

export function FormActions({ onClose, isEditing, submitting }: FormActionsProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onClose} 
        disabled={submitting} 
        className="text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {t("Atcelt", "Cancel", "Atšaukti", "Tühista")}
      </Button>
      <Button 
        type="submit" 
        disabled={submitting} 
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
      >
        {submitting 
          ? t("Notiek...", "Processing...", "Vykdoma...", "Töötleb...") 
          : isEditing 
            ? t("Atjaunināt", "Update", "Atnaujinti", "Uuenda") 
            : t("Pievienot", "Add", "Pridėti", "Lisa")}
      </Button>
    </div>
  );
}
