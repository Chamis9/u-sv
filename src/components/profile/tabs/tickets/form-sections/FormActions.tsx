
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onClose: () => void;
  isEditing: boolean;
  submitting: boolean;
  t: (lv: string, en: string) => string;
}

export function FormActions({ onClose, isEditing, submitting, t }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onClose} 
        disabled={submitting} 
        className="text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {t("Atcelt", "Cancel")}
      </Button>
      <Button 
        type="submit" 
        disabled={submitting} 
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
      >
        {submitting 
          ? t("Notiek...", "Processing...") 
          : isEditing 
            ? t("Atjaunināt", "Update") 
            : t("Pievienot", "Add")}
      </Button>
    </div>
  );
}
