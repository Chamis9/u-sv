
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
      <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
        {t("Atcelt", "Cancel")}
      </Button>
      <Button type="submit" disabled={submitting}>
        {submitting 
          ? t("Notiek...", "Processing...") 
          : isEditing 
            ? t("Atjaunināt", "Update") 
            : t("Pievienot", "Add")}
      </Button>
    </div>
  );
}
